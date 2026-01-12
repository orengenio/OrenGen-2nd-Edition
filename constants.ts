import { FileNode } from "./types";

export const MOCK_FILE_SYSTEM: FileNode[] = [
    {
        id: 'root',
        name: 'Project Alpha',
        type: 'folder',
        children: [
            {
                id: 'src',
                name: 'src',
                type: 'folder',
                children: [
                    { id: 'app', name: 'App.tsx', type: 'file', content: '// Main Application Logic...' },
                    { id: 'utils', name: 'utils.ts', type: 'file', content: 'export const add = (a, b) => a + b;' },
                ]
            },
            { id: 'package', name: 'package.json', type: 'file', content: '{\n  "name": "alpha",\n  "version": "1.0.0"\n}' },
            { id: 'readme', name: 'README.md', type: 'file', content: '# Project Alpha\n\nThis is a confidential project.' },
            { id: 'env', name: '.env', type: 'file', content: 'API_KEY=sk_test_12345' },
        ]
    },
    {
        id: 'docs',
        name: 'Documents',
        type: 'folder',
        children: [
            { id: 'fin', name: 'financials_2024.csv', type: 'file', content: 'id,amount,date\n1,500,2024-01-01' },
        ]
    }
];

export const MOCK_BROWSER_DOM = `
<div class="dashboard">
  <h1>Stripe Dashboard</h1>
  <div class="stats">
    <div class="card">Gross Volume: $12,450.00</div>
    <div class="card">Net Volume: $10,200.00</div>
  </div>
  <form id="payout-form">
    <input type="text" name="amount" placeholder="Amount" />
    <button id="payout-btn">Initiate Payout</button>
  </form>
  <div class="recent-transactions">
     <!-- List of items -->
  </div>
</div>
`;
