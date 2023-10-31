# OData V2 to SQL

## Introdution

This repo contains a simple tool to convert OData V2 metadata to SQL DDL statements.

## Docs

[oData v2](https://www.odata.org/documentation/odata-version-2-0/)
[SQL Where W3](https://www.w3schools.com/sql/sql_where.asp)

## Usage

`npm i odatav2-to-sql`

```js
const { parseODataV2Url } = require('odatav2-to-sql');
// or ES6
import { parseODataV2Url } from 'odatav2-to-sql';

const _url = `http://services.odata.org/V2/Northwind/Northwind.svc/Customers?$filter=Country eq 'Germany' and City eq 'Berlin'&$orderby=Country desc, City asc&$skip=0&$top=10&$select=CustomerID,CompanyName,ContactName,ContactTitle,Address,City,Region,PostalCode,Country,Phone,Fax&$inlinecount=allpages&$format=json'`

const sql = parseODataV2Url(_url);

console.log(sql);
```

## TODO

- [ ] Add type support (currently only string is supported)
- [ ] Add support for `$expand`

