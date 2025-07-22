import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Octokit } from "octokit"
import { MenuCategory } from "@/database/page"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!
const OWNER = process.env.OWNER!
const REPO = process.env.REPO!
const FILE_PATH = process.env.FILE_PATH!
const BRANCH = 'master'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function updateMenuFile(navMain: MenuCategory[]) {
  const octokit = new Octokit({ auth: GITHUB_TOKEN })

  const { data: file } = await octokit.rest.repos.getContent({
    owner: OWNER,
    repo: REPO,
    path: FILE_PATH,
    ref: BRANCH,
  })

  const content = Buffer.from(
    JSON.stringify({ navMain }, null, 2)
  ).toString("base64")

  await octokit.rest.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path: FILE_PATH,
    message: "chore: update menu.json via UI",
    content,
    // @ts-expect-error GitHubContentResponse has `sha`
    sha: file.sha,
    branch: BRANCH
  })
}
