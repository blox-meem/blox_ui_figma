export async function downloadFile(page: PageNode): Promise<void> {
    return await new Promise<void>(r => setTimeout(r, 1000));
}