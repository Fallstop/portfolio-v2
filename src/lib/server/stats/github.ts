import { Octokit } from "@octokit/rest";
import type { Endpoints } from "@octokit/types";
import { GITHUB_AUTH_TOKEN } from "../env";

const additionalOrgs = ["Questionable-Research-Labs", "zui-nz", "openhealthnz-credentials"]

export interface GithubStats {
    totalRepoCount: number;
    lastUpdatedAboutDetails: Date | null;
    total_starred_repos: number;
}

export async function getGithubStats(): Promise<GithubStats> {
    let totalRepoCount = 0;
    let total_starred_repos = 0;

    if (!GITHUB_AUTH_TOKEN) {
        console.log("No github token provided, skipping github stats")
        return {
            totalRepoCount,
            lastUpdatedAboutDetails: null,
            total_starred_repos
        }
    }

    const octokit = new Octokit({ auth: GITHUB_AUTH_TOKEN });

    const getRepoCount = (response: { data: Endpoints["GET /user" | "GET /orgs/{org}"]["response"]["data"]; }) => {
        const orgInfo = response.data;
        totalRepoCount += orgInfo.public_repos;
        totalRepoCount += orgInfo.total_private_repos ?? 0;
    };

    const personalUser = octokit.request("GET /user").then(getRepoCount);

    const orgs = additionalOrgs.map(async (org) => {
        return octokit.request("GET /orgs/{org}", { org }).then(getRepoCount);
    });

    let lastUpdatedAboutDetails: Date | null = null;

    const commitsList = octokit.request("GET /repos/{owner}/{repo}/commits", {
        owner: "fallstop",
        repo: "portfolio-v2",
    }).then((response) => {
        const aboutInfo = response.data;
        const authorDate = aboutInfo[0].commit.author?.date;
        lastUpdatedAboutDetails = authorDate ? new Date(authorDate) : null;
    });


    const starred_repos = octokit.paginate(octokit.activity.listReposStarredByAuthenticatedUser).then((response) => {
        total_starred_repos = response.length;
    });

    await Promise.allSettled([personalUser, commitsList, starred_repos, ...orgs]);

    return {
        totalRepoCount,
        lastUpdatedAboutDetails,
        total_starred_repos
    }
}