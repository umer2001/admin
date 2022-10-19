import { useAdminProductTypes } from "medusa-react"
import React, { useState } from "react"
import Modal from "../../../../../../../components/molecules/modal"
import { SelectableTable } from "../../../../../../../components/templates/selectable-table"
import useQueryFilters from "../../../../../../../hooks/use-query-filters"
import { defaultQueryProps } from "../../../../../new/discount-form/condition-tables/shared/common"
import {
  TypeRow,
  TypesHeader,
  useTypesColumns,
} from "../../../../../new/discount-form/condition-tables/shared/types"
import { useEditConditionContext } from "../../edit-condition-provider"
import ExistingConditionTableActions from "../../existing-condition-resources-table-actions"

const ProductTypesConditionsTable = () => {
  const params = useQueryFilters(defaultQueryProps)

  const {
    condition,
    removeConditionResources,
    isLoading,
  } = useEditConditionContext()

  const {
    isLoading: isLoadingTypes,
    count,
    product_types,
  } = useAdminProductTypes(
    { discount_condition_id: condition.id, ...params.queryObject },
    {
      keepPreviousData: true,
    }
  )

  const columns = useTypesColumns()

  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])

  const onDeselect = () => {
    setSelectedRowIds([])
  }

  const onRemove = () => {
    removeConditionResources(selectedRowIds)
    onDeselect()
  }

  return (
    <Modal.Content>
      <SelectableTable
        options={{
          enableSearch: false,
          tableActions: (
            <ExistingConditionTableActions
              numberOfSelectedRows={selectedRowIds.length}
              onDeselect={onDeselect}
              onRemove={onRemove}
              deleting={isLoading}
            />
          ),
        }}
        resourceName="product_types"
        totalCount={count!}
        selectedIds={selectedRowIds}
        data={product_types || []}
        columns={columns}
        isLoading={isLoadingTypes}
        onChange={(ids) => setSelectedRowIds(ids)}
        renderRow={TypeRow}
        renderHeaderGroup={TypesHeader}
        {...params}
      />
    </Modal.Content>
  )
}

export default ProductTypesConditionsTable
