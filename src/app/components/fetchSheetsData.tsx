export interface Profile {
    id: number;
    name: string;
    photo: string;
    age: number;
    country: string;
    interest: string;
    netWorth: number;
}

const SPREADSHEET_ID = '1LyTrX1M99DsxBHkHvn1aUqMzAzRIPOwKDoQSxz2ulZM';

export async function fetchGoogleSheetsData(accessToken: string): Promise<Profile[]> {
    // Fetches columns A through F starting from row 2 (skipping header)
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/A2:F201`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch sheet data: ${response.statusText}`);
    }

    const data = await response.json();
    const rows = data.values || [];

    return rows.map((row: string[], index: number) => {
        // Convert string "$251,260.80" -> 251260.80
        const rawNetWorth = row[5] || '$0';
        const netWorthNum = parseFloat(rawNetWorth.replace(/[^0-9.-]+/g, '')) || 0;

        return {
            id: index + 1,
            name: row[0] || 'Unknown',
            photo: row[1] || '',
            age: parseInt(row[2], 10) || 0,
            country: row[3] || 'N/A',
            interest: row[4] || 'N/A',
            netWorth: netWorthNum,
        };
    });
}