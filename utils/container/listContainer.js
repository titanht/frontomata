const fs = require('fs');
const path = require('path');
const camelCase = require('camelcase');
const { tab, writeImports } = require('../common-utils');

const getListImports = (modelName, corePrefix) => {
  return {
    '@mui/material': ['Box'],
    react: ['useState'],
    [`${corePrefix}/../core/hooks/useFetchApiData`]: 'useFetchApiData',
    [`${corePrefix}/../core/ui/layout/Layout`]: 'Layout',
    [`${corePrefix}/../core/ui/table/TableContainer`]: 'TableContainer',
    [`${corePrefix}/../core/ui/table/tableTypes`]: ['TableHeader'],
    [`${corePrefix}/../core/utils/types`]: ['Model', 'Paginated'],
    [`../${camelCase(modelName)}`]: [modelName],
  };
};

const generateTableHeader = (data) => {
  let template = 'const tableHeaders: TableHeader[] = [\n';

  const displayFields = [];
  data.forEach((row) => {
    displayFields.push(...row.filter((item) => item.showOnTable));
  });

  template += displayFields
    .map(
      ({ name, tableLabel, align }) =>
        `${tab}{ field: '${name}', label: '${tableLabel || name}', align: '${
          align || 'left'
        }' },`
    )
    .join('\n');

  template += '\n];';

  return template;
};

const generateListClass = ({ modelName, endpoint, modelToken }) => {
  return `const ${modelName}List = () => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const { fetchData } = useFetchApiData();

  const handleFetchData = async (query: any, cb: (c: number) => void) => {
    await fetchData('${endpoint}', {
      onSuccess: ({ total, data: apiData }: Paginated<${modelName}>) => {
        setData(apiData);
        cb(total);
      },
    });
  };

  const handleDelete = async (model: Model) => {
    // TODO: Handle
  };

  return (
    <>
      <Layout>
        <Box sx={{ p: 2 }}>
          <TableContainer
            modelToken="${modelToken}"
            tableHeaders={tableHeaders}
            data={data}
            modelLabel="${modelName}s"
            addRoute="${endpoint}/create"
            editRoutePrefix="${endpoint}/edit"
            actions={{
              onFetchData: handleFetchData,
              onDelete: handleDelete,
            }}
          />
        </Box>
      </Layout>
    </>
  );
};

export default ${modelName}List;
`;
};

exports.writeListContainer = ({
  data,
  modelName,
  modelToken,
  endpoint,
  corePrefix,
  baseOutputFolder,
}) => {
  let template = writeImports(getListImports(modelName, corePrefix)) + '\n';
  template += generateTableHeader(data) + '\n';
  template += generateListClass({ modelName, modelToken, endpoint });

  fs.writeFileSync(
    path.join(baseOutputFolder, 'components', `${modelName}List.tsx`),
    template
  );
};
