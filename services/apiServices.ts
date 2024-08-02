export class ApiService {
    async sendData(data: { data: string[] }): Promise<any> {
        const res = await fetch('http://localhost:3002/bfhl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return res.json();
    }
}