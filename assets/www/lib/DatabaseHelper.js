var $list = '0';


var DatabaseHelper = {
	db: null,
	dbSupported: false,
	_defaultOptions: {
		shortName: 'WebSqlDB',
		version : '1.0',
		displayName : 'WebSqlDB', 
		maxSize : 512000
	},
	init: function(options) {
		if (!options) {
			options = {};
		}
		var _options = jQuery.extend({},DatabaseHelper._defaultOptions,options);
		console.log('DB - Initializing DatabaseHelper');
		
		if (!window.openDatabase) { 
			console.log('DB - Browser doesn\'t support databases');
			return false;
		} 
		
		DatabaseHelper.dbSupported = true;
		DatabaseHelper.db = openDatabase(
								_options.shortName, 
								_options.version, 
								_options.displayName,
								_options.maxSize
							); 
		
		if (!DatabaseHelper.db) {
			console.log('DB - Failed to load database.');
			return false;
		}
		//DatabaseHelper.uninstall();
		DatabaseHelper.install();
		
		
		return true;
	},
	install: function() {
		DatabaseHelper.db.transaction(function(tx){ 
	
			tx.executeSql( 
				"CREATE TABLE IF NOT EXISTS 'lists' (" + 
				"'id'  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL COLLATE BINARY  DEFAULT 0," + 
				"'name'  TEXT NOT NULL," + 
				"'budget'  INTEGER NOT NULL,UNIQUE ('id' ASC) ON CONFLICT ABORT);"
			);  
			tx.executeSql( 
				"CREATE TABLE IF NOT EXISTS 'products' (" +
				"'bar_code'  INTEGER NOT NULL," +
				"'name' TEXT NOT NULL," +
				"'liked'  INTEGER NOT NULL DEFAULT 0," + 
				"'categorized'  INTEGER NOT NULL DEFAULT 0," + 
				"PRIMARY KEY ('bar_code' ASC)," +
				"CONSTRAINT 'un_products_bar_code' UNIQUE ('bar_code' ASC) ON CONFLICT ABORT);"
			);
			
			tx.executeSql( 
				"CREATE TABLE IF NOT EXISTS 'categories' (" +
				"'id'  INTEGER PRIMARY KEY NOT NULL ," +
				"'name'  TEXT NOT NULL,UNIQUE ('id' ASC) ON CONFLICT ABORT);"
			);
			
			tx.executeSql( 
				"CREATE TABLE IF NOT EXISTS 'lists_products' (" +
				"'quantity'  INTEGER NOT NULL DEFAULT 0," +
				"'bar_code'  TEXT NOT NULL," +
				"'list_id'  INTEGER NOT NULL," +
				"'name'  TEXT NOT NULL," +
				"PRIMARY KEY ('bar_code', 'list_id')," +
				"CONSTRAINT 'list_id' FOREIGN KEY ('list_id') REFERENCES 'lists' ('id') ON DELETE CASCADE ON UPDATE CASCADE," +
				"CONSTRAINT 'id' UNIQUE ('list_id', 'bar_code') ON CONFLICT ABORT);"
			);
		},
		function(err) {
			console.log('DB - Failed to install database, Error: ' + err.message + '. Code: ' + err.code);
		},
		function() {
			console.log('DB - Database installed successful');
		});
	},
	uninstall: function() {
		DatabaseHelper.db.transaction(function(tx){
			tx.executeSql('DROP TABLE IF EXISTS lists');
			tx.executeSql('DROP TABLE IF EXISTS lists_products');
			tx.executeSql('DROP TABLE IF EXISTS products');
			tx.executeSql('DROP TABLE IF EXISTS categories');
			
		},
		function(err){
			console.log('DB - Failed to uninstall database, Error: ' + err.message + '. Code: ' + err.code);
		},
		function() {
			console.log('DB - Database uninstalled successful');
		});
	
	},
	getLastInsertRowId : function(tx) {
		var id = 0;
		
		tx.executeSql('SELECT last_insert_rowid() as id', [], function(transaction, result) {
			id = result.rows.item(0).id;
		});
		return id;
	}
	
}
/*
DatabaseHelper.db.transaction(function(tx) {
	console.log("entered");
				tx.executeSql("INSERT INTO 'categories' (id,name) VALUES (?, ?);", [1, 'cereales'], function() {
				console.log("thisissparta");	
				}, function(err) {
					console.log('DB - error saving category - ' + err.message);
				});
				//operation.records[i].data.id = DatabaseHelper.getLastInsertRowId(tx);
			});
*/