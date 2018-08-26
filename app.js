function syncReqPokeApi(reqType, i) {

	// POKE TYPES
	if (reqType == 1) {
		request("http://pokeapi.co/api/v2/type/" + i, function(error, response, body){
			var data = JSON.parse(body);
			var gen = data["generation"]["url"].split("/")[6];
			sql = "INSERT INTO pokeType (id, name, generation) VALUES ("+ i + ", '"+ data["name"] + "', " + gen + ")";
			con.query(sql, function (err, result) {
				if (err) 
					throw err;
				console.log("Record inserted");
			});
		});
	}

	// POKEMONS
	else if (reqType == 2){
		request("http://pokeapi.co/api/v2/pokemon/" + i, function(error, response, body){
			if (response.statusCode >= 200 && response.statusCode <= 299) {
				var data = JSON.parse(body);
				var id = data["id"];
				var name = data["name"];
				var height = data["height"];
				var weight = data["weight"];
				var baseXP = data["base_experience"];
				var type1Id, type2Id;
				if (data["types"].length > 1) {
					type1Id = data["types"][1]["type"]["url"].split("/")[6];
					type2Id = data["types"][0]["type"]["url"].split("/")[6];
				}
				else {
					type1Id = data["types"][0]["type"]["url"].split("/")[6];
					type2Id = null;
				}
				// var img = {
				// 	img: fs.readFileSync(data["sprites"]["front_default"]),
				// 	file_name: name
				// }
				sql = "INSERT INTO pokemon (id, weight, height, name, baseXP, image, generation, type1Id, type2Id) VALUES (?,?,?,?,?,?,?,?,?)";
				con.query(sql, [id, weight, height, name, baseXP, null, 1, type1Id, type2Id], function (err, result) {
					if (err) 
						throw err;
					console.log("Record " + id + " inserted");
				});
			}
			else {
				console.log('error:', error); // Print the error if one occurred
				console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			}
		});
	}

	// Damage Chart
	else if (reqType == 3){
		request("http://pokeapi.co/api/v2/type/" + i, function(error, response, body){
			var data = JSON.parse(body);
			var defId = data["id"]
			var rows = [];
			console.log(data);
			data["damage_relations"]["half_damage_from"].forEach(function(relation) {
				var attId = relation["url"].split("/")[6];
				rows.push("("+ attId + ","+ defId +", 0.5)");
			});
			data["damage_relations"]["no_damage_from"].forEach(function(relation) {
				var attId = relation["url"].split("/")[6];
				rows.push("("+ attId + ","+ defId +", 0)");
			});
			data["damage_relations"]["double_damage_from"].forEach(function(relation) {
				var attId = relation["url"].split("/")[6];
				rows.push("("+ attId + ","+ defId +", 2.0)");
			});
			sql = "INSERT INTO damageMultiplier (attackingTypeId, defendingTypeId, multiplier) VALUES " + rows.join(",");
			con.query(sql, function (err, result) {
				if (err) 
					throw err;
				console.log("Record inserted");
			});
		});	
	}

	// ABILITIES
	else if (reqType == 4){
		request("http://pokeapi.co/api/v2/ability/" + i, function(error, response, body){
			if (response.statusCode >= 200 && response.statusCode <= 299) {
				var data = JSON.parse(body);
				var name = data["name"];
				var desc = data["effect_entries"][0]["short_effect"];
				var sql = "INSERT INTO ability (id, name, description) VALUES (?,?,?)";
				con.query(sql, [i, name, desc], function (err, result) {
					if (err) {
						console.log("Error on id " + i);
						throw err;
					}
					console.log("Record " + i + " inserted");
				});
			}
			else {
				console.log('error:', error); // Print the error if one occurred
				console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			}
		});
	}

	// MOVES
	else if (reqType == 5){
		request("http://pokeapi.co/api/v2/move/" + i, function(error, response, body){
			if (response.statusCode >= 200 && response.statusCode <= 299) {
				var data = JSON.parse(body);
				var id = data["id"];
				var typeId = data["type"]["url"].split("/")[6];
				var pp = data["pp"];
				if (pp == null)
					pp = 0;
				var name = data["name"];
				var acc = data["accuracy"];
				if (acc == null)
					acc = 0;
				var pow = data["power"];
				if (pow == null)
					pow = 0;
				var desc = data["effect_entries"][0]["short_effect"];
				var dmgClass = data["damage_class"]["name"];
				var ailment = data["meta"]["ailment"]["name"];
				var sql = "INSERT INTO move (id, typeId, name, class, power, accuracy, pp, ailment, description) VALUES (?,?,?,?,?,?,?,?,?)";
				con.query(sql, [id, typeId, name, dmgClass, pow, acc, pp, ailment, desc], function (err, result) {
					if (err) {
						console.log("Error on id " + id);
						throw err;
					}
					console.log("Record " + id + " inserted");
				});
			}
			else {
				console.log('error:', error); // Print the error if one occurred
				console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			}
		});	
	}

	// REGION
	else if (reqType == 6){
		request("http://pokeapi.co/api/v2/region/" + i, function(error, response, body){
			if (response.statusCode >= 200 && response.statusCode <= 299) {
				var data = JSON.parse(body);
				var name = data["name"];
				var gen = data["main_generation"]["url"].split("/")[6];
				var sql = "INSERT INTO region (id, name, generation) VALUES (?,?,?)";
				con.query(sql, [i, name, gen], function (err, result) {
					if (err) {
						console.log("Error on id " + i);
						throw err;
					}
					console.log("Record " + i + " inserted");
				});
			}
			else {
				console.log('error:', error); // Print the error if one occurred
				console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			}
		});
	}

	// GAME and GAMEPOKEMON and SET POKEMON GENERATION
	else if (reqType == 7){
		request("http://pokeapi.co/api/v2/generation/" + i, function(error, response, body){
			if (response.statusCode >= 200 && response.statusCode <= 299) {
				var data = JSON.parse(body);
				var regionId = data["main_region"]["url"].split("/")[6];
				var year = 1996;
				var gen = data["id"];
				var platform = "Teste";
				data["version_groups"].forEach(function(game) {
					var id = game["url"].split("/")[6];
					var name = game["name"].replace("-", " and ");	
					var sql = "INSERT INTO game (id, regionId, name, year, generation, platform) VALUES (?,?,?,?,?,?)";
					con.query(sql, [id, regionId, name, year, gen, platform], function (err, result) {
						if (err) {
							console.log("Error on id " + id);
							throw err;
						}
						console.log("Record " + id + " inserted");
						data["pokemon_species"].forEach(function (pokemon) {
							var pokeId = pokemon["url"].split("/")[6];
							sql = "INSERT INTO gameHasPokemon (gameId, pokeId) VALUES (?,?)";
							con.query(sql, [id, pokeId], function (err, result) {
								if (err) {
									console.log("Insert: Error on id " + pokeId);
									throw err;
								}
								console.log("Record " + pokeId + " inserted");
							});	
							sql = "UPDATE pokemon SET generation = " + gen + " WHERE id = " + pokeId;
							con.query(sql, function (err, result) {
								if (err) {
									console.log("Update: Error on id " + pokeId);
									throw err;
								}
								console.log("Record " + pokeId + " updated");
							});	
						});
					});		
				});	
			}
			else {
				console.log('error:', error); // Print the error if one occurred
				console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			}
		});		
	}

	// POKEMON HAS ABILITIES
	else if (reqType == 8){
		request("http://pokeapi.co/api/v2/ability/" + i, function(error, response, body){
			if (response.statusCode >= 200 && response.statusCode <= 299) {
				var data = JSON.parse(body);
				var id = data["id"];
				data["pokemon"].forEach(function(pokemon) {
					var pokeId = pokemon["pokemon"]["url"].split("/")[6];
					if (pokeId < 722){
						var sql = "INSERT INTO pokemonHasAbility (pokeId, abilityId) VALUES (?,?)";
						con.query(sql, [pokeId, id], function (err, result) {
							if (err) {
								console.log("Error on id " + id + "with pokemon " + pokeId);
								throw err;
							}
							console.log("Record " + id + " with pokemon " + pokeId + " inserted");
						});
					}
				});
			}
			else {
				console.log('error:', error); // Print the error if one occurred
				console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			} 
		});	
	}

	// POKEMON MOVES
	else if (reqType == 9){
		request("http://pokeapi.co/api/v2/pokemon/" + i, function(error, response, body){
			if (response.statusCode >= 200 && response.statusCode <= 299) {
				var data = JSON.parse(body);
				var id = data["id"];
				data["moves"].forEach(function (move) {
					var moveId = move["move"]["url"].split("/")[6];
					var level = move["version_group_details"][0]["level_learned_at"];
					sql = "INSERT INTO pokemonMove (pokeId, moveId, level) VALUES (?,?,?)";
					con.query(sql, [id, moveId, level], function (err, result) {
						if (err) {
							console.log("Error on id " + id + "with move " + moveId);
							throw err;
						}
						console.log("Record " + id + " with move " + moveId + " inserted");
					});
				});
			}
			else {
				console.log('error:', error); // Print the error if one occurred
				console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			}
		});
	}	

	// Damage multiplier fill
	else if (reqType == 10){
		sql = "SELECT * FROM damageMultiplier WHERE 1;";
		con.query(sql, function (err, result) {
			if (err) {
				throw err;
			}
			else {
				for (var i = 1; i < 19; i++) {
					for (var j = 1; j < 19; j++) {
						var flag = true;
						result.forEach(function (damageMultiplier) {
							if (damageMultiplier.attackingTypeId == i && damageMultiplier.defendingTypeId == j)
								flag = false;
						});
						if (flag) {
							sql = "INSERT INTO damageMultiplier (attackingTypeId, defendingTypeId, multiplier) VALUES (?,?,?)";
							con.query(sql, [i, j, 1], function (err, result) {
								if (err) 
									throw err;
								console.log("Record inserted");
							});
						}
					}
				}
			}
		});
	}

	// Pokemon Images
	else if (reqType == 11) {
		for (var i = 1; i < 722 ; i++) {
			if (i > 649)
				var id = 0;
			else
				var id = i;
			var image = fs.readFileSync("public/images/sprites/"+ id +".png");
			con.query('UPDATE pokemon SET image = ? WHERE id = ?', [image, i], function(err, result) {
				if (err) 
					throw err;
				console.log(result);
			});
		}
	}
}

function getTypeColor(typeId) {
	switch(typeId){
		case 1: return "";
				break;
		case 2: return "red";
				break;
		case 3: return "teal";
				break;
		case 4: return "purple";
				break;
		case 5: return "orange";
				break;
		case 6: return "brown";
				break;
		case 7: return "olive";
				break;
		case 8: return "violet";
				break;
		case 9: return "grey";
				break;
		case 10: return "red";
				break;
		case 11: return "blue";
				break;
		case 12: return "green";
				break;
		case 13: return "yellow";
				break;
		case 14: return "pink";
				break;
		case 15: return "blue";
				break;
		case 16: return "violet";
				break;
		case 17: return "black";
				break;
		case 18: return "pink";
				break;
		default: return "";
				break;
	}
}

var express    = require('express'),
	bodyParser = require('body-parser'),
	mysql      = require('mysql'),
	request    = require('request'),
	fs         = require('fs'),
	_          = require("underscore"); 
	app        = express();

var con = mysql.createConnection({
	host     : 'db',
	user     : 'root',
	password : 'root',
	database : 'pokedex'
});

con.connect(function(err) {
	if (err) 
		throw err;
	
	console.log("Connected to the database!");
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// ROUTES

app.get('/', function(req, res){
	res.render("index", {query : req.query, currentUrl: "home"});
});

app.get('/pokemon', function(req, res){
	if (req.query.q){
		var sql = "SELECT id, name, type1Id FROM pokemon WHERE name LIKE ?";
		con.query(sql, ['%' + req.query.q + '%'],function (err, result) {
			if (err) {
				console.log("Error on query");
				throw err;
				res.render("search", {query: req.query, currentUrl: "pokemon"});
			}
			else {
				result.forEach(function(pokemon) {
					pokemon["color"] = getTypeColor(pokemon["type1Id"]);
				});
				res.render("search", {pokemons: result, currentUrl: "pokemon", query: req.query})
			}
		});
	}
	else {
		var sql = "SELECT id, name, type1Id FROM pokemon WHERE 1";
		con.query(sql, function (err, result) {
			if (err) {
				console.log("Error on query");
				throw err;
				res.render("search", {query : req.query, currentUrl: "pokemon"});
			}
			else {
				result.forEach(function(pokemon) {
					pokemon["color"] = getTypeColor(pokemon["type1Id"]);
				});
				res.render("search", {query : req.query, pokemons: result, currentUrl: "pokemon"})
			}
		});
	}
});

app.get('/pokemon/:id', function(req, res){
	var id = req.params.id;
	var sql1 = "SELECT pokemon.*, pt1.name as tipo1, pt2.name as tipo2, game.name as jogo, region.name as regiao FROM pokemon JOIN pokeType pt1 ON pokemon.type1Id = pt1.id LEFT JOIN pokeType pt2 ON pokemon.type2Id = pt2.id JOIN gameHasPokemon ON pokemon.id = gameHasPokemon.pokeId JOIN game ON gameHasPokemon.gameId = game.id JOIN region ON region.id = game.regionId WHERE pokemon.id = " + id;
	var sql2 = "SELECT ability.* FROM pokemon JOIN pokemonHasAbility ON pokemon.id = pokemonHasAbility.pokeId JOIN ability ON pokemonHasAbility.abilityId = ability.id WHERE pokemon.id = " + id;
	var sql3 = "SELECT move.*, pokemonMove.level, pokeType.name as tipo FROM pokemon JOIN pokemonMove ON pokemon.id = pokemonMove.pokeId JOIN move ON pokemonMove.moveId = move.id JOIN pokeType ON move.typeId = pokeType.id WHERE pokemon.id = " + id + " ORDER BY pokemonMove.level"; 
	con.query(sql1, function (err, result) {
		if (err) {
			console.log("Error on query");
			throw err;
			res.render("view", {query : req.query, currentUrl: "error"});
		}
		else {
			result.forEach(function(pokemon) {
				pokemon["type1Color"] = getTypeColor(pokemon["type1Id"]);
				pokemon["type2Color"] = getTypeColor(pokemon["type2Id"]);
			});
			var pokemon = result[0];
			if (pokemon) {
				con.query(sql2, function (err, result) {
					if (err) {
						console.log("Error on query");
						throw err;
						res.render("view", {query : req.query, currentUrl: "error"});
					}
					else { 
						var pokemonAbilities = result;
						con.query(sql3, function (err, result) {
							if (err) {
								console.log("Error on query");
								throw err;
								res.render("view", {query : req.query, currentUrl: "error"});
							}
							else {
								result.forEach(function(move) {
									move["typeColor"] = getTypeColor(move["typeId"]);
								});
								var pokemonMoves = _.sortBy(result, function(move) {
									return move.level || Infinity ;
								});
								res.render("view", {query : req.query, pokemon: pokemon, pokemonAbilities: pokemonAbilities, pokemonMoves: pokemonMoves, currentUrl: "pokemon"})
							}
						});
					}
				});
			}
			else 
				res.render("view", {query : req.query, currentUrl: "error"});
		}
	});
});

app.listen(8080, function(){
	console.log('Pokedex listening on port 8080!');
});