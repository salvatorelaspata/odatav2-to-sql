const _transcodeOperator = (operator) => {
  switch (operator) {
    case 'eq':
      return '=';
    case 'ne':
      return '!=';
    case 'gt':
      return '>';
    case 'ge':
      return '>=';
    case 'lt':
      return '<';
    case 'le':
      return '<=';
    default:
      throw new Error(`Operator ${operator} not supported`);
  }
};

const _createWhereClausole = (whereConditions) => {
  const whereClausole = [];
  whereConditions.forEach((condition) => {
    const { field, operator, value } = condition;
    whereClausole.push(`${field} ${_transcodeOperator(operator)} '${value}'`);
  });
  return whereClausole.join(' AND ');
};

const parseODataV2Url = (_url) => {
  const url = decodeURIComponent(_url);
  const queryIndex = url.indexOf('?');
  const query = url.substring(queryIndex + 1);
  const queryParams = query.split('&');
  const whereConditions = [];
  let selectFields = [];

  const config = { top: '', skip: '', orderby: '', format: '', inlinecount: '' };


  queryParams.forEach((param) => {
    const [key, value] = param.split('=');
    if (key === '$filter') {
      const andConditions = value.split(' and ');
      andConditions.forEach((condition) => {
        // remove all parenthesis
        condition = condition.replace(/\(/g, '').replace(/\)/g, '');

        const [field, operator, fieldValue] = condition.split(' ');

        whereConditions.push({
          field,
          operator,
          value: fieldValue.replace(/'/g, ''),
        });
      });
    } else if (key === '$select') {
      selectFields = value.split(',');
    } else if (key === '$top' || key === '$skip' || key === '$orderby' || key === '$format' || key === '$inlinecount') {
      config[key.substring(1)] = value;
    }
  });

  return {
    whereConditions,
    whereClausole: _createWhereClausole(whereConditions),
    selectFields,
    selectClausole: selectFields.join(','),
    ...config
  };
};

module.exports = parseODataV2Url;

const _url = `http://services.odata.org/V2/Northwind/Northwind.svc/Customers?$filter=Country eq 'Germany' and City eq 'Berlin'&$orderby=Country desc, City asc&$skip=0&$top=10&$select=CustomerID,CompanyName,ContactName,ContactTitle,Address,City,Region,PostalCode,Country,Phone,Fax&$inlinecount=allpages&$format=json`

console.log(JSON.stringify(parseODataV2Url(_url), null, 2))