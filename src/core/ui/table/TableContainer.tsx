import useTablePagination from './hooks/useTablePagination';
import GenericTable from './components/GenericTable';
import { TableHeader } from './tableTypes';
import DeleteAction from '../utility/DeleteAction';
import GenericTableFooter from './components/GenericTableFooter';
import FilterBlock from './components/FilterBlock';
import useSorting from './hooks/useSorting';
import useFieldVisibility from './hooks/useFieldVisibility';
import useChecklist from './hooks/useChecklist';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Model } from '../../../core/utils/types';
import { Edit } from '@mui/icons-material';
import SummaryBlock from './components/SummaryBlock';
import { Grid } from '@mui/material';

type GenericTableActions = {
  onFetchData: (cb: (c: number) => void) => Promise<void>;
  onDelete: (m: Model) => Promise<void>;
};

type GenericTableContainerProps = {
  modelToken: string;
  data: Record<string, any>[];
  tableHeaders: TableHeader[];
  editRoutePrefix: string;
  addRoute: string;
  modelLabel: string;
  actions: GenericTableActions;
};

const GenericTableContainer = ({
  modelToken,
  tableHeaders,
  data,
  editRoutePrefix,
  addRoute,
  modelLabel,
  actions: { onFetchData, onDelete },
}: GenericTableContainerProps) => {
  const [loading, setLoading] = useState(false);
  const [tableDense, setTableDense] = useState(false);
  const {
    data: { page, rowsPerPage, total },
    handlers: { handleChangePage, handleChangeRowsPerPage },
  } = useTablePagination();
  const { sortField, sortOp, handleSort } = useSorting(modelToken);
  const { fieldVisible, handleToggleFieldVisibility } = useFieldVisibility(
    modelToken,
    tableHeaders
  );
  const { checklist, toggleChecklist } = useChecklist(data);

  useEffect(() => {
    setLoading(true);
    (async () => {
      await onFetchData((total) => {
        // setTotal(total)
        console.log('set total');
      });

      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, sortField, sortOp]);

  const filteredHeaders = tableHeaders.filter(
    (header) => fieldVisible[header.field]
  );

  return (
    <>
      <GenericTable
        data={data}
        tableHeaders={filteredHeaders}
        checklist={checklist}
        toggleChecklist={toggleChecklist}
        size={tableDense ? 'small' : 'medium'}
        sorting={{
          orderBy: sortField,
          orderOp: sortOp,
          onSort: handleSort,
        }}
        loading={loading}
        renderSummary={() => (
          <SummaryBlock
            modelLabel={modelLabel}
            addRoute={addRoute}
            buttonLabel={`+ New ${modelLabel}`}
            itemCount={total}
          />
        )}
        renderFilterBlock={() => (
          <FilterBlock
            tableHeaders={tableHeaders}
            fieldVisible={fieldVisible}
            toggleFieldVisibility={handleToggleFieldVisibility}
            tableDense={tableDense}
            toggleTableDensity={setTableDense}
          />
        )}
        renderFooter={() => (
          <GenericTableFooter
            pagination={{
              page,
              rowsPerPage,
              total,
              handleChangePage,
              handleChangeRowsPerPage,
            }}
          />
        )}
        renderActions={(item: Model) => (
          <>
            <Grid container justifyContent="flex-end" alignItems="flex-end">
              <Link to={`${editRoutePrefix}/${item.id}`}>
                <Edit fontSize="small" sx={{ mr: 1, fontSize: '15px' }} />
              </Link>
              <DeleteAction
                message="Are you sure you want to remove entry?"
                onDelete={async (e) => {
                  // e.stopPropagation();
                  onDelete(item);
                }}
              />
            </Grid>
          </>
        )}
      />
    </>
  );
};

export default GenericTableContainer;