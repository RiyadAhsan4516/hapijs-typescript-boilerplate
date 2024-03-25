export async function payloadFormatter(data: any): Promise<{total_count : number, data : any}> {
    let total_count: number = 1;
    if (data.total_count) return data
    return {
        total_count,
        data: [data]
    }
}
