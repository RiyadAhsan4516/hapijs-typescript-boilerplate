export async function payloadFormatter(data: any): Promise<{total_count : number, data : any}> {
    let is_array : boolean = Array.isArray(data)

    if (data.total_count) return data
    return {
        total_count : is_array? data.length : 1,
        data
    }
}
