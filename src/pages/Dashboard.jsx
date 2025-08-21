import React from 'react';
import { Api } from '../api';

export default function Dashboard() {
  const [health, setHealth] = React.useState(null);
  React.useEffect(() => { Api.health().then(setHealth).catch(()=>setHealth({success:false})) }, []);
  return (
    <div>
      <h2>Dashboard</h2>
      {!health ? <p>Loading...</p> :
        <pre style={{background:'#f7f7f7',padding:12,borderRadius:8}}>
          {JSON.stringify(health, null, 2)}
        </pre>}
    </div>
  );
}
