export const maps = new Map();

maps.set('map1', {
    columns: 8,
    rows: 4,
    speed: 1,
    bullet_speed: 4,
    aliens_count: 16,
    alien: {
        img: 'images/alien1.png',
        points: 10,
    },
    spaceship: {
        img: 'images/ship1.png',
        speed: 6,
        bullet_speed: 10,
        lives: 5,
        cooldown: 300
    },
    tiles: [
        1, 0, 1, 0, 1, 0, 1, 0,
        0, 1, 0, 1, 0, 1, 0, 1,
        1, 0, 1, 0, 1, 0, 1, 0,
        0, 1, 0, 1, 0, 1, 0, 1,
    ],
})

maps.set('map2', {
    columns: 8,
    rows: 5,
    speed: 2,
    bullet_speed: 5,
    aliens_count: 20,
    alien: {
        img: 'images/alien2.png',
        points: 20,
    },
    spaceship: {
        img: 'images/ship2.png',
        speed: 5,
        bullet_speed: 8,
        lives: 3,
        cooldown: 400
    },
    tiles: [
        1, 1, 1, 1, 1, 1, 1, 1,
        0, 1, 1, 1, 1, 1, 1, 0,
        0, 0, 1, 1, 1, 1, 0, 0,
        0, 0, 0, 1, 1, 0, 0, 0,
    ]
    
})


maps.set('map3', {
    columns: 8,
    rows: 4,
    speed: 2,
    bullet_speed: 5,
    aliens_count: 32,
    alien: {
        img: 'images/alien3.png',
        points: 30,
    },
    spaceship: {
        img: 'images/ship3.png',
        speed: 5,
        bullet_speed: 8,
        lives: 3,
        cooldown: 200
    },
    tiles: [
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
    ]
    
})

