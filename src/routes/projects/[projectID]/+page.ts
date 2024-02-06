export async function load({ parent, data }) {
    await parent();
    const { meta } = data;
    const post = await import(`../../../projects/${meta.postID}/${meta.postID}.md`);
    return {
        meta,
        content: post.default,
    }
}