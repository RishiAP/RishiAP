import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { Project, LanguageUsage } from "@/types/commonTypes";
// Get the allowed origins from the environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',');

export const runtime = 'edge'; // Edge function for better performance

export async function GET(req:NextRequest) {
  try {
    const origin = req.headers.get('origin') || req.nextUrl.origin;

    // Determine if the origin is allowed
    const isAllowedOrigin = allowedOrigins?.includes(origin) || origin === req.nextUrl.origin;
    if (!isAllowedOrigin) {
      return NextResponse.json(
        { error: "Unauthorized origin" },
        { status: 403 }
      );
    }

    const token = process.env.GITHUB_TOKEN;

    // Validate if the token is provided
    if (!token) {
      return NextResponse.json(
        { error: "GitHub token is missing in environment variables." },
        { status: 500 }
      );
    }

    // Fetch the list of repositories
    const reposResponse = await axios.get<Project[]>(
      `https://api.github.com/users/${process.env.GITHUB_USERNAME}/repos`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const projectsData = reposResponse.data.sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );

    // Fetch languages for all repositories
    const languagePromises = projectsData.map((project) =>
      axios.get<Record<string, number>>(
        `https://api.github.com/repos/${project.full_name}/languages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    );

    const languagesResponses = await Promise.allSettled(languagePromises);

    // Map language data and project details
    const projectsWithLanguages = projectsData.map((project, index) => {
      const languageResult = languagesResponses[index];

      let languages: LanguageUsage[] = [];
      if (languageResult.status === "fulfilled") {
        const languageData = languageResult.value.data;
        const totalBytes = Object.values(languageData).reduce(
          (acc, bytes) => acc + bytes,
          0
        );

        languages = Object.keys(languageData).map((language) => ({
          language,
          percentage: (languageData[language] / totalBytes) * 100,
        }));
      } else {
        console.error(
          `Failed to fetch languages for ${project.full_name}:`,
          languageResult.reason
        );
      }

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        html_url: project.html_url,
        language: project.language,
        stargazers_count: project.stargazers_count,
        forks_count: project.forks_count,
        updated_at: project.updated_at,
        full_name: project.full_name,
        languages,
      };
    });

    const response=NextResponse.json(projectsWithLanguages, { status: 200 });
    response.headers.set('Access-Control-Allow-Origin', origin);
    return response;
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
