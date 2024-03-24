export async function payloadFormatter (totalData : number = 1, data : any) {
    return {
        totalCount : data.total_count? data.total_count : totalData,
        data : data.total_count? data.result : data
    }
}
