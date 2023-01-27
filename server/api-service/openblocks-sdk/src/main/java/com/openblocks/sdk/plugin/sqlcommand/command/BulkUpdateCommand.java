package com.openblocks.sdk.plugin.sqlcommand.command;

import static com.google.common.collect.Lists.newArrayList;
import static com.openblocks.sdk.exception.PluginCommonError.INVALID_INSERT_COMMAND;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.tuple.Pair;

import com.google.common.base.Joiner;
import com.google.common.collect.ArrayListMultimap;
import com.openblocks.sdk.exception.PluginException;
import com.openblocks.sdk.plugin.sqlcommand.GuiSqlCommand;
import com.openblocks.sdk.plugin.sqlcommand.changeset.BulkObjectChangeSet;
import com.openblocks.sdk.plugin.sqlcommand.changeset.ChangeSetRows;
import com.openblocks.sdk.util.MustacheHelper;

public class BulkUpdateCommand implements GuiSqlCommand {

    protected final String table;
    protected final BulkObjectChangeSet bulkObjectChangeSet;
    protected final String primaryKey;
    protected final String columnFrontDelimiter;
    protected final String columnBackDelimiter;

    protected BulkUpdateCommand(String table, BulkObjectChangeSet bulkObjectChangeSet, String primaryKey,
            String columnFrontDelimiter, String columnBackDelimiter) {
        this.table = table;
        this.bulkObjectChangeSet = bulkObjectChangeSet;
        this.primaryKey = primaryKey;
        this.columnFrontDelimiter = columnFrontDelimiter;
        this.columnBackDelimiter = columnBackDelimiter;
    }

    @Override
    public GuiSqlCommandRenderResult render(Map<String, Object> requestMap) {

        String renderedTable = MustacheHelper.renderMustacheString(table, requestMap);

        ChangeSetRows updateRows = bulkObjectChangeSet.render(requestMap);
        if (updateRows.isEmpty()) {
            throw new PluginException(INVALID_INSERT_COMMAND, "UPDATE_DATA_EMPTY");
        }

        if (updateRows.stream()
                .anyMatch(row -> !row.getColumns().contains(primaryKey))) {
            throw new PluginException(INVALID_INSERT_COMMAND, "BULK_UPDATE_DATA_NOT_CONTAIN_PRIMARY_KEY");
        }

        StringBuilder sb = new StringBuilder();
        List<Object> bindParams = newArrayList();

        sb.append("UPDATE ").append(renderedTable).append(" set\n");
        appendCaseWhen(updateRows, sb, bindParams);
        appendWhere(updateRows, sb, bindParams);

        return new GuiSqlCommandRenderResult(sb.toString(), bindParams);
    }

    private void appendWhere(ChangeSetRows updateRows, StringBuilder sb, List<Object> bindParams) {
        String questionMarks = Joiner.on(",").join(Collections.nCopies(updateRows.size(), "?"));
        sb.append("where ").append(primaryKey)
                .append(" in (")
                .append(questionMarks)
                .append(")");
        bindParams.addAll(updateRows.stream()
                .map(row -> row.getItem(primaryKey).psBindValue().getValue())
                .toList());
    }

    private void appendCaseWhen(ChangeSetRows updateRows, StringBuilder sb, List<Object> bindParams) {
        // column_1 = CASE WHEN any_column = value THEN column_1_value end,
        ArrayListMultimap<String, Pair<Object, Object>> columnToIdAndValue = ArrayListMultimap.create();

        updateRows.stream().forEach(row -> {
                    Object pkValue = row.getItem(primaryKey).psBindValue().getValue();
                    row.stream()
                            .filter(changeSetItem -> !primaryKey.equals(changeSetItem.column()))
                            .forEach(changeSetItem -> {
                                String column = changeSetItem.column();
                                Object value = changeSetItem.psBindValue().getValue();
                                columnToIdAndValue.put(column, Pair.of(pkValue, value));
                            });
                }
        );

        columnToIdAndValue.asMap().forEach((column, pkAndValues) -> {
                    String columnWithDelimiter = columnFrontDelimiter + column + columnBackDelimiter;
                    sb.append(columnWithDelimiter)
                            .append(" = CASE ");
                    pkAndValues.forEach(pkAndValue -> {
                        Object pkValue = pkAndValue.getKey();
                        Object updateValue = pkAndValue.getValue();
                        sb.append("WHEN ")
                                .append(columnFrontDelimiter)
                                .append(primaryKey)
                                .append(columnBackDelimiter)
                                .append(" = ? THEN ? ");
                        bindParams.add(pkValue);
                        bindParams.add(updateValue);
                    });
                    sb.append("ELSE ").append(columnWithDelimiter).append(" END,\n");
                }
        );
        sb.deleteCharAt(sb.length() - 1)
                .deleteCharAt(sb.length() - 1)
                .append("\n");
    }

    @Override
    public boolean isInsertCommand() {
        return false;
    }

    @Override
    public Set<String> extractMustacheKeys() {
        return bulkObjectChangeSet.extractMustacheKeys();
    }
}
