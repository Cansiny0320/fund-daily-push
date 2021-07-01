import axios from 'axios';
import {readFileSync} from 'fs';
import {resolve} from 'path';
import {stringify} from 'qs';
const fundIds = JSON.parse(
  readFileSync(resolve(__dirname, './fund.json'), 'utf-8')
);

const SCKEY = process.env.SCKEY;

async function pushMessage(text: string, desp: string) {
  const {data} = await axios.post(
    `https://sc.ftqq.com/${SCKEY}.send`,
    stringify({
      text,
      desp,
    }),
    {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
    }
  );
  console.log(data);
}

async function getMyFundDetail(fundId: string) {
  return axios.get(
    `https://fundmobapi.eastmoney.com/FundMApi/FundVarietieValuationDetail.ashx?FCODE=${fundId}&deviceid=D03E8A22-9E0A-473F-B045-3745FC7931C4&plat=Iphone&product=EFund&version=6.2.9&GTOKEN=793EAE9248BC4181A9380C49938D1E31`
  );
}

async function main() {
  const result: any[] = [];
  for (let i = 0; i < fundIds.length; i++) {
    const {data} = await getMyFundDetail(fundIds[i]);
    const {Expansion} = data;
    result.push({fundName: Expansion.SHORTNAME, fundValue: Expansion.GSZZL});
  }
  let desp = '';
  desp += new Date().toLocaleDateString() + '\n';
  result.forEach((e: any) => {
    desp += `${e.fundName} ${e.fundValue}%\n`;
  });
  console.log(desp);
  pushMessage('今日涨跌', desp);
}

main();
