package com.openblocks.sdk.plugin.sqlcommand.command.postgres;

import static com.openblocks.sdk.plugin.sqlcommand.changeset.BulkObjectChangeSet.parseBulkRecords;
import static com.openblocks.sdk.plugin.sqlcommand.changeset.BulkObjectChangeSet.parsePrimaryKey;
import static com.openblocks.sdk.plugin.sqlcommand.command.GuiConstants.POSTGRES_COLUMN_DELIMITER;

import java.util.Map;

import com.openblocks.sdk.plugin.sqlcommand.GuiSqlCommand;
import com.openblocks.sdk.plugin.sqlcommand.changeset.BulkObjectChangeSet;
import com.openblocks.sdk.plugin.sqlcommand.command.BulkUpdateCommand;

public class PostgresBulkUpdateCommand extends BulkUpdateCommand {

    protected PostgresBulkUpdateCommand(String table, BulkObjectChangeSet bulkObjectChangeSet,
            String primaryKey) {
        super(table, bulkObjectChangeSet, primaryKey, POSTGRES_COLUMN_DELIMITER, POSTGRES_COLUMN_DELIMITER);
    }

    public static PostgresBulkUpdateCommand from(Map<String, Object> commandDetail) {
        String table = GuiSqlCommand.parseTable(commandDetail);
        String recordStr = parseBulkRecords(commandDetail);
        BulkObjectChangeSet bulkObjectChangeSet = new BulkObjectChangeSet(recordStr);
        return new PostgresBulkUpdateCommand(table, bulkObjectChangeSet, parsePrimaryKey(commandDetail));
    }

}
