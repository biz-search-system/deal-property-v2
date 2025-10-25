import { Card, CardContent } from "@workspace/ui/components/card";
import { getProperties } from "@/lib/data/property";
import { UnconfirmedPropertiesTable } from "@/components/property/unconfirmed-properties-table";

export default async function UnconfirmedPropertiesPage() {
  // BC確定前の案件のみフィルター
  const allProperties = await getProperties();
  const unconfirmedProperties = allProperties.filter(
    (p) => p.progressStatus === "bc_before_confirmed"
  );

  // 集計計算
  const totals = {
    profitEstimate: unconfirmedProperties.reduce(
      (sum, p) => sum + (p.profit || 0),
      0
    ),
    count: unconfirmedProperties.length,
  };

  const formatCurrency = (value: number) => {
    return value ? `${(value / 10000).toFixed(0)}万` : "-";
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-col gap-4 p-4 lg:p-6">
        {/* 集計表示 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-muted/50 p-3 border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                利益見込み合計
              </span>
              <p className="text-sm font-bold">
                {formatCurrency(totals.profitEstimate)}
              </p>
            </div>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">A金額合計</span>
              <p className="text-sm font-bold">
                {formatCurrency(totals.aAmount)}
              </p>
            </div>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">件数</span>
              <p className="text-sm font-bold">{totals.count}件</p>
            </div>
          </div>
        </div>

        {/* 案件一覧テーブル */}
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-auto max-h-[calc(100vh-400px)]">
              <Table className="text-[10px]">
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="text-[10px] p-1 sticky left-0 bg-background z-20 min-w-[45px]">
                      担当
                    </TableHead>
                    <TableHead className="text-[10px] p-1 min-w-[65px]">
                      物件名
                    </TableHead>
                    <TableHead className="text-[10px] p-1 w-[40px]">
                      号室
                    </TableHead>
                    <TableHead className="text-[10px] p-1 min-w-[55px]">
                      オーナー
                    </TableHead>
                    <TableHead className="text-[10px] p-1 w-[50px]">
                      A金額
                    </TableHead>
                    <TableHead className="text-[10px] p-1 w-[50px]">
                      出口
                    </TableHead>
                    <TableHead className="text-[10px] p-1 w-[50px]">
                      仲手等
                    </TableHead>
                    <TableHead className="text-[10px] p-1 w-[50px]">
                      利益
                    </TableHead>
                    <TableHead className="text-[10px] p-1 min-w-[45px]">
                      契約形態
                    </TableHead>
                    <TableHead className="text-[10px] p-1 min-w-[45px]">
                      B会社
                    </TableHead>
                    <TableHead className="text-[10px] p-1 min-w-[50px]">
                      仲介
                    </TableHead>
                    <TableHead className="text-[10px] p-1 min-w-[50px]">
                      進捗
                    </TableHead>
                    <TableHead className="text-[10px] p-1 min-w-[50px]">
                      書類
                    </TableHead>
                    <TableHead className="text-[10px] p-1 w-[120px]">
                      備考
                    </TableHead>
                    <TableHead className="text-[10px] p-1 sticky right-0 bg-background z-20 min-w-[35px]">
                      操作
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unconfirmedProperties.map((property) => (
                    <TableRow key={property.id} className="hover:bg-muted/50">
                      <TableCell className="text-[10px] p-1 sticky left-0 bg-background">
                        <div className="flex gap-1 flex-wrap">
                          {property.assignee.map((person, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-[9px] px-1 py-0"
                            >
                              {person}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-[10px] p-1">
                        {property.propertyName}
                      </TableCell>
                      <TableCell className="text-[10px] p-1">
                        {property.roomNumber}
                      </TableCell>
                      <TableCell className="text-[10px] p-1">
                        {property.ownerName}
                      </TableCell>
                      <TableCell className="text-[10px] p-1 text-right">
                        {formatCurrency(property.aAmount)}
                      </TableCell>
                      <TableCell className="text-[10px] p-1 text-right">
                        {formatCurrency(property.exitAmount)}
                      </TableCell>
                      <TableCell className="text-[10px] p-1 text-right">
                        {formatCurrency(property.commission)}
                      </TableCell>
                      <TableCell className="text-[10px] p-1 text-right font-semibold">
                        {formatCurrency(property.profit)}
                      </TableCell>
                      <TableCell className="text-[10px] p-1">
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1 py-0"
                        >
                          {truncateText(property.contractType)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[10px] p-1">
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1 py-0"
                        >
                          {truncateText(property.bCompany)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[10px] p-1">
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1 py-0"
                        >
                          {truncateText(property.brokerCompany)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[10px] p-1">
                        {editingBusinessStatus?.id === property.id ? (
                          <Select
                            value={editingBusinessStatus.value}
                            onValueChange={(value) => {
                              setEditingBusinessStatus({
                                ...editingBusinessStatus,
                                value,
                              });
                              handleBusinessStatusSave(property.id);
                            }}
                          >
                            <SelectTrigger className="h-5 text-[10px] p-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(BUSINESS_STATUS)
                                .filter(
                                  (s) => s !== BUSINESS_STATUS.BC_UNCONFIRMED
                                )
                                .map((status) => (
                                  <SelectItem
                                    key={status}
                                    value={status}
                                    className="text-[10px]"
                                  >
                                    {status}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[9px] cursor-pointer px-1 py-0"
                            onClick={() =>
                              setEditingBusinessStatus({
                                id: property.id,
                                value: property.businessStatus,
                              })
                            }
                          >
                            {truncateText(property.businessStatus, 6)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-[10px] p-1">
                        {editingDocumentStatus?.id === property.id ? (
                          <Select
                            value={editingDocumentStatus.value}
                            onValueChange={(value) => {
                              setEditingDocumentStatus({
                                ...editingDocumentStatus,
                                value,
                              });
                              handleDocumentStatusSave(property.id);
                            }}
                          >
                            <SelectTrigger className="h-5 text-[10px] p-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(DOCUMENT_STATUS).map((status) => (
                                <SelectItem
                                  key={status}
                                  value={status}
                                  className="text-[10px]"
                                >
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge
                            variant={getDocumentStatusColor(
                              property.documentStatus
                            )}
                            className="text-[9px] cursor-pointer px-1 py-0"
                            onClick={() =>
                              setEditingDocumentStatus({
                                id: property.id,
                                value: property.documentStatus,
                              })
                            }
                          >
                            {property.documentStatus}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-[10px] p-1">
                        {editingMemo?.id === property.id ? (
                          <Input
                            value={editingMemo.value}
                            onChange={(e) =>
                              setEditingMemo({
                                ...editingMemo,
                                value: e.target.value,
                              })
                            }
                            className="h-5 text-[10px] p-1"
                            onBlur={() => handleMemoSave(property.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleMemoSave(property.id);
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          <div
                            className="cursor-pointer hover:bg-muted px-1 rounded text-[10px] truncate break-all max-w-[120px]"
                            onClick={() =>
                              setEditingMemo({
                                id: property.id,
                                value: property.memo,
                              })
                            }
                            title={property.memo}
                          >
                            {property.memo || (
                              <span className="text-muted-foreground">
                                入力
                              </span>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-[10px] p-1 sticky right-0 bg-background">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0"
                            >
                              <MoreVertical className="h-3 w-3" />
                              <span className="sr-only">操作メニュー</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                router.push(
                                  `/properties/unconfirmed/${property.id}`
                                );
                              }}
                            >
                              <Eye className="h-3 w-3" />
                              詳細
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedProperty(property);
                                setModalOpen(true);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                              編集
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 案件編集モーダル */}
        <PropertyDetailModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          property={selectedProperty}
        />
      </div>
    </div>
  );
}
