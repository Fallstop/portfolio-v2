import { Octokit } from "@octokit/core";
import type { Endpoints } from "@octokit/types";
const githubToken = import.meta.env.VITE_GITHUB_AUTH_TOKEN || "";

const additionalOrgs = ["Questionable-Research-Labs", "zui-nz", "openhealthnz-credentials"]

export interface GithubStats {
    totalRepoCount: number;
}

export async function getGithubStats(): Promise<GithubStats> {
    let totalRepoCount = 0;

    if (!githubToken) {
        console.log("No github token provided, skipping github stats")
        return {
            totalRepoCount,
        }
    }

    const octokit = new Octokit({ auth: githubToken });

    const getRepoCount = (response: { data: Endpoints["GET /user" | "GET /orgs/{org}"]["response"]["data"]; }) => {
        const orgInfo = response.data;
        totalRepoCount += orgInfo.public_repos;
        totalRepoCount += orgInfo.total_private_repos ?? 0;
    };

    const personalUser = octokit.request("GET /user").then(getRepoCount);

    const orgs = additionalOrgs.map(async (org) => {
        return octokit.request("GET /orgs/{org}", { org }).then(getRepoCount);
    });

    await Promise.all([personalUser, ...orgs]);

    return {
        totalRepoCount,
    }
}