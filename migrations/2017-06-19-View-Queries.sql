SELECT 
    pokemon.*,
    pt1.name AS tipo1,
    pt2.name AS tipo2,
    game.name AS jogo,
    region.name AS regiao
FROM
    pokemon
        JOIN
    pokeType pt1 ON pokemon.type1Id = pt1.id
        LEFT JOIN
    pokeType pt2 ON pokemon.type2Id = pt2.id
        JOIN
    gameHasPokemon ON pokemon.id = gameHasPokemon.pokeId
        JOIN
    game ON gameHasPokemon.gameId = game.id
        JOIN
    region ON region.id = game.regionId
WHERE
    pokemon.id = 63;

SELECT 
    ability.*
FROM
    pokemon
        JOIN
    pokemonHasAbility ON pokemon.id = pokemonHasAbility.pokeId
        JOIN
    ability ON pokemonHasAbility.abilityId = ability.id
WHERE
    pokemon.id = 63;

SELECT 
    move.*, pokemonMove.level, pokeType.name AS tipo
FROM
    pokemon
        JOIN
    pokemonMove ON pokemon.id = pokemonMove.pokeId
        JOIN
    move ON pokemonMove.moveId = move.id
        JOIN
    pokeType ON move.typeId = pokeType.id
WHERE
    pokemon.id = 63
ORDER BY pokemonMove.level;