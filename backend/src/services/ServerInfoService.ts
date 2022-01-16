import {networkInterfaces} from 'os'


export default class ServerInfoService {

  constructor() {

  }

  getIp() {
    const nets = networkInterfaces();
    const results = Object.create(null); // Or just '{}', an empty object

    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
          // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
          if (net.family === 'IPv4' && !net.internal) {
              if (!results[name]) {
                  results[name] = [];
              }
              results[name].push(net.address);
          }
      }
    }

    const ips : string[] = Object.values(results as any[]).reduce((out, v) => [...out, ...v], [])

    // sort trying to find a local ip (192.x.x.x)
    // otherwise return the first one
    console.log(ips)
    const [ip] = ips.sort((a, b) => {
      if(a.startsWith('192') && !b.startsWith('192')) {
        return -1  
      }
      else if(!b.startsWith('192') && a.startsWith('192')) {
        return 1
      }
      else {
        return 0
      }
    })
    return ip
  }
}