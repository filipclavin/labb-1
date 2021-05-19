var expect = require('chai').expect;
var request = require('request');

describe('Random Number Generator', () => {
    describe('Random', () => {
        let url = 'http://localhost:3000/api/random'

        it('returns status 200', (done) => {
            request(url, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                done()
            });
        });

        it('returns a JSON object', (done) => {
            request(url, (error, response, body) => {
                expect(JSON.parse(response.body)).to.be.an('object')
                done()
            });
        })

        it('generates a random number between 0 and 1023', (done) => {
            request(url, (error, response, body) => {
                expect(JSON.parse(response.body).number).to.be.within(0, 1023);
                done()
            });
        })
    })

    describe('Custom Random', () => {
        let urlPos = 'http://localhost:3000/api/custom_random/100'
        let urlNeg = 'http://localhost:3000/api/custom_random/-100'
        let urlStr = 'http://localhost:3000/api/custom_random/hello'

        it('returns status 200', (done) => {
            request(urlPos, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                done()
            });
        });

        it('returns a JSON object', (done) => {
            request(urlPos, (error, response, body) => {
                expect(JSON.parse(response.body)).to.be.an('object')
                done()
            });
        })

        it('generates a random number between 0 and a positive user-input integer', (done) => {
            request(urlPos, (error, response, body) => {
                expect(JSON.parse(response.body).number).to.be.within(0, 100);
                done()
            });
        })

        it('generates a random number between 0 and a negative user-input integer', (done) => {
            request(urlNeg, (error, response, body) => {
                expect(JSON.parse(response.body).number).to.be.within(-100, 0);
                done()
            })
        })

        it('returns status 404 and promts the user to correct their input on non-integer input', (done) => {
            request(urlStr, (error, response, body) => {
                expect(response.statusCode).to.equal(404);
            })

            request(urlStr, (error, response, body) => {
                expect(response.body).to.equal('Invalid input. Please enter an integer.');
                done()
            })
        })
    })
})

describe('Vowel Counter', () => {
    let url = 'http://localhost:3000/api/vowels/abcef'

    it('returns status 200', (done) => {
        request.post(url, (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            done()
        })
    })

    it('returns a JSON object', (done) => {
        request.post(url, (error, response, body) => {
            expect(JSON.parse(response.body)).to.be.an('object')
            done()
        });
    })

    it('returns the number of vowels that appear in the user-input string', () => {
        request.post(url, (error, response, body) => {
            expect(JSON.parse(response.body).vowels).to.equal(2);
        })
    })
})

describe('Number of Requests', () => {
    let url = 'http://localhost:3000/api/usage'

    it('returns status 200', (done) => {
        request(url, (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            done()
        })
    })

    it('returns a JSON object', (done) => {
        request(url, (error, response, body) => {
            expect(JSON.parse(response.body)).to.be.an('object')
            done()
        });
    })

    it('returns the number of requests that have been made since server started', (done) => {
        request(url, (error, response, body) => {
            expect(JSON.parse(response.body).requests).to.be.a('number')
            done()
        })
    })
})

describe('Guestbook', () => {
    describe('Get Entries', () => {
        let url = 'http://localhost:3000/api/guestbook'

        it('returns status 200', (done) => {
            request(url, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                done()
            })
        })

        it('returns a JSON array', (done) => {
            request(url, (error, response, body) => {
                expect(JSON.parse(response.body)).to.be.an('array')
                done()
            });
        })

        it('gets all entries in the guestbook', (done) => {
            request(url, (error, response, body) => {
                expect(JSON.parse(response.body)).to.be.an('array')
                done()
            })
        })
    })

    describe('Get Entry', () => {
        let url = 'http://localhost:3000/api/guestbook/5'

        it('returns status 200', (done) => {
            request(url, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                done()
            })
        })

        it('returns a JSON object', (done) => {
            request(url, (error, response, body) => {
                expect(JSON.parse(response.body)).to.be.an('object')
                done()
            });
        })

        it('gets one specific entry from the guestbook based on EntryID', (done) => {
            request(url, (error, response, body) => {
                expect(JSON.parse(response.body).EntryID).to.equal(5)
                done()
            })
        })
    })

    describe('Delete Entry', () => {
        let url = 'http://localhost:3000/api/guestbook/1'

        it('returns status 200', (done) => {
            request(url, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                done()
            })
        })

        it('returns a string', (done) => {
            request(url, (error, response, body) => {
                expect(response.body).to.be.a('string')
                done()
            });
        })

        it('deletes an entry from the guestbook based on EntryID', (done) => {
            request.delete(url, (error, response, body) => {
                expect(response.body).to.equal('Deletion successful')
                done()
            })
        })
    })

    describe('Add Entry', () => {
        const options = {
            'method': 'POST',
            'url': 'http://localhost:3000/api/guestbook',
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "EntryID": 0,
                "Name": "Filip Clavin",
                "Msg": "Hey! Im newer!"
            })
        }

        it('returns status 200', (done) => {
            request(options, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                done()
            })
        })

        it('returns a JSON object', (done) => {
            request(options, (error, response, body) => {
                expect(JSON.parse(response.body)).to.be.an('object')
                done()
            });
        })

        it('adds an entry to the guestbook', (done) => {
            request(options, (error, response, body) => {
                expect(JSON.parse(response.body).EntryID).to.be.greaterThan(0);
                done()
            })
        })
    })

    describe('Update Entry', () => {
        const options = {
            'method': 'PUT',
            'url': 'http://localhost:3000/api/guestbook',
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "EntryID": 1,
                "Name": "Krille",
                "Msg": "Yo"
            })

        }

        it('returns status 200', (done) => {
            request(options, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                done()
            })
        })

        it('returns a string', (done) => {
            request(options, (error, response, body) => {
                expect(response.body).to.be.a('string')
                done()
            });
        })

        it('updates an entry in the guestbook', (done) => {
            request(options, function (error, response, body) {
                expect(response.body).to.equal('Update successful');
                done()
            })
        })
    })
})

describe('Bank', () => {
    describe('Balance', () => {
        let url = 'http://localhost:3000/api/bank/balance'

        it('returns status 200', (done) => {
            request(url, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                done()
            })
        })

        it('returns a JSON object', (done) => {
            request(url, (error, response, body) => {
                expect(JSON.parse(response.body)).to.be.an('object')
                done()
            })
        })

        it('returns bank account balance and wallet balance', (done) => {
            request(url, (error, response, body) => {
                expect(JSON.parse(response.body)).to.have.all.keys('bankBalance', 'walletBalance')
                done()
            })
        })
    })

    describe('Deposit', () => {
        let url = 'http://localhost:3000/api/bank/deposit/5'
        let badUrl = 'http://localhost:3000/api/bank/deposit/5000'
        let strUrl = 'http://localhost:3000/api/bank/deposit/hej'

        it('returns status 200', (done) => {
            request.post(url, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                done()
            })
        })

        it('returns a JSON object', (done) => {
            request.post(url, (error, response, body) => {
                expect(JSON.parse(response.body)).to.be.an('object')
                done()
            })
        })

        it('does not let the user deposit more than the wallet balance', (done) => {
            request.post(badUrl, (error, response, body) => {
                expect(response.body).to.equal('You cannot deposit more than your wallet balance.');
                done()
            })
        })

        it('promts the user to correct their input on non-integer input', (done) => {
            request.post(strUrl, (error, response, body) => {
                expect(response.body).to.equal('Please enter an integer.');
                done()
            })
        })

        it('returns bank account balance and wallet balance', (done) => {
            request.post(url, (error, response, body) => {
                expect(JSON.parse(response.body)).to.have.all.keys('bankBalance', 'walletBalance')
                done()
            })
        })
    })

    describe('Withdraw', () => {
        let url = 'http://localhost:3000/api/bank/withdraw/5'
        let badUrl = 'http://localhost:3000/api/bank/withdraw/5000'
        let strUrl = 'http://localhost:3000/api/bank/withdraw/hej'

        it('returns status 200', (done) => {
            request.post(url, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                done()
            })
        })

        it('returns a JSON object', (done) => {
            request.post(url, (error, response, body) => {
                expect(JSON.parse(response.body)).to.be.an('object')
                done()
            })
        })

        it('does not let the user withdraw more than the bank balance', (done) => {
            request.post(badUrl, (error, response, body) => {
                expect(response.body).to.equal('You cannot withdraw more than your bank balance.');
                done()
            })
        })

        it('promts the user to correct their input on non-integer input', (done) => {
            request.post(strUrl, (error, response, body) => {
                expect(response.body).to.equal('Please enter an integer.');
                done()
            })
        })

        it('returns bank account balance and wallet balance', (done) => {
            request.post(url, (error, response, body) => {
                expect(JSON.parse(response.body)).to.have.all.keys('bankBalance', 'walletBalance')
                done()
            })
        })
    })
})