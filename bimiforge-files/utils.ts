export interface DnsAnswer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

export interface DnsResponse {
  Status: number;
  Answer?: DnsAnswer[];
}

export const resolveDns = async (name: string, type: string): Promise<DnsAnswer[]> => {
  try {
    const response = await fetch(`https://dns.google/resolve?name=${name}&type=${type}`);
    const data: DnsResponse = await response.json();
    return data.Answer || [];
  } catch (error) {
    console.error('DNS Lookup failed', error);
    return [];
  }
};

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};