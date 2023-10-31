const assert = require('node:assert');
const { mock, test } = require('node:test');
const parseODataV2Url = require('.');

test('test $filter', () => {
  const url = encodeURIComponent("/MessageProcessingLog?$filter=logstart eq 'TEST' and logend eq 'TEST2' and packagename eq TEST2 and integrationflowname eq 'TEST2' and status eq 'STATUS'");
  const result = mock.fn(parseODataV2Url);
  assert.strictEqual(result.mock.calls.length, 0);

  assert.deepStrictEqual(result(url), {
    whereConditions: [
      {
        field: "logstart",
        operator: "eq",
        value: "TEST"
      },
      {
        field: "logend",
        operator: "eq",
        value: "TEST2"
      },
      {
        field: "packagename",
        operator: "eq",
        value: "TEST2"
      },
      {
        field: "integrationflowname",
        operator: "eq",
        value: "TEST2"
      },
      {
        field: "status",
        operator: "eq",
        value: "STATUS"
      }
    ],
    whereClausole: `WHERE logstart = 'TEST' AND logend = 'TEST2' AND packagename = 'TEST2' AND integrationflowname = 'TEST2' AND status = 'STATUS'`,
    selectFields: [],
    selectClausole: 'SELECT *',
    format: '',
    inlinecount: '',
    orderby: '',
    skip: '',
    top: '',
  });

  assert.strictEqual(result.mock.calls.length, 1);
  // Reset the globally tracked mocks.
  mock.reset();
});

test('test complex odata', () => {

  const url = `http://services.odata.org/V2/Northwind/Northwind.svc/Customers?$filter=Country eq 'Germany' and City eq 'Berlin'&$orderby=Country desc, City asc&$skip=0&$top=10&$select=CustomerID,CompanyName,ContactName,ContactTitle,Address,City,Region,PostalCode,Country,Phone,Fax&$inlinecount=allpages&$format=json`
  const result = mock.fn(parseODataV2Url);
  assert.strictEqual(result.mock.calls.length, 0);

  assert.deepStrictEqual(result(url), {
    whereConditions: [
      {
        field: "Country",
        operator: "eq",
        value: "Germany"
      },
      {
        field: "City",
        operator: "eq",
        value: "Berlin"
      }
    ],
    whereClausole: "WHERE Country = 'Germany' AND City = 'Berlin'",
    selectFields: [
      "CustomerID",
      "CompanyName",
      "ContactName",
      "ContactTitle",
      "Address",
      "City",
      "Region",
      "PostalCode",
      "Country",
      "Phone",
      "Fax"
    ],
    selectClausole: "SELECT CustomerID,CompanyName,ContactName,ContactTitle,Address,City,Region,PostalCode,Country,Phone,Fax",
    top: "10",
    skip: "0",
    orderby: "Country desc, City asc",
    format: "json",
    inlinecount: "allpages"
  });

  assert.strictEqual(result.mock.calls.length, 1);
  // Reset the globally tracked mocks.
  mock.reset();
});