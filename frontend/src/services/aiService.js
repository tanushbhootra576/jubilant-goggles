export async function fetchAIExplain(wardId) {
    const res = await fetch(`/api/ai?wardId=${wardId}`);
    return res.json();
}
