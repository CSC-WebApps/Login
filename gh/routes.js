const express = require('express');
const router = require('express').Router();
const got = require('got');

require('dotenv').config();

const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET;

router.get('/login', (req, res) => {
    const params = new URLSearchParams({
        client_id,
        scope: '' //'public_repo user:email',
    });

    res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

router.get('/oauth-callback', async (req, res) => {
    const { code, redirect_uri } = req.query;

    const githubToken = await got.post(`https://github.com/login/oauth/access_token`, {
        timeout: 10000,
        json: {
            client_id,
            client_secret,
            code
        },
        responseType: 'json',
        resolveBodyOnly: true
    });

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${githubToken.access_token}`
    };

    const githubApiUser = await got.get('https://api.github.com/user', {
        headers,
        responseType: 'json',
        resolveBodyOnly: true
    });

    req.session.githubOauth = {
        githubToken,
        githubApiUser
    };

    res.redirect('/gh');
});

router.get('/logout', (req, res) => {
    req.session.destroy((err)=> {
        res.redirect('/gh');
    });
});

router.get('/', (req, res) => {
    if (req.session.githubOauth) {
        res.render('../gh/views/index.ejs', { githubApiUser: req.session.githubOauth.githubApiUser });
    }
    else {
        res.render('../gh/views/index.ejs');
    }
})

module.exports = router;
