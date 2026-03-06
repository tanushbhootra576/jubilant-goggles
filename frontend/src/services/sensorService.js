export function normalizeWards(raw) {
    if (!raw) return [];
    return raw.map(w => ({
        wardId: w.wardId,
        name: w.name,
        location: w.location,
        power: Number(w.power || 0),
        water: Number(w.water || 0),
        traffic: Number(w.traffic || 0)
    }));
}
