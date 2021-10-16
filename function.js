var data2 = [];

function setIDs() {
    const ids = document.getElementById('ticket-ids').value;
    data2 = [];
    data2.push(ids);
    data2 = JSON.stringify(data2);
    data2 = data2.replace('["','');
    data2 = data2.replace('"]','');
    data2 = data2.split(',');
}

function estimatedTime() {
    let seconds = "";

    if(document.getElementById('ticket-response').value == "") {
        seconds = ((data2.length*0.05)*1.14);
    } else {
        seconds = ((data2.length*0.25)*1.14);
    }

    let minutes = Math.floor(seconds/60);
    let minutesNulls = ('0' + minutes%60);
    let hours = Math.floor(minutes/60);
    let hoursOver24 = "";
    
    if (hours >= 24) {
        hoursOver24 = hours
    }

    let hoursNulls = ('0' + hours%24);
    seconds = seconds%60;
    seconds = Math.floor(seconds);
    minutes = minutes%60;
    minutes = Math.floor(minutes);
    hours = hours%24;
    hours = Math.floor(hours);
    let secondsNulls = ('0' + seconds)

    if (secondsNulls < 10) {
        seconds = secondsNulls;
    }
    if (minutesNulls < 10) {
        minutes = minutesNulls;
    }
    if (hoursNulls < 10) {
        hours = hoursNulls;
    }

    if (hoursOver24 >= 24) {
        document.querySelector('#estTime').value = "Estimated time: Over 1 day!"
    } else if (hours >= 2 && hours < 24) {
        document.querySelector('#estTime').value = "Estimated time: " + hours + ":" + minutes + ":" + seconds + " hours";
    } else if (hours == 1) {
        document.querySelector('#estTime').value = "Estimated time: " + hours + ":" + minutes + ":" + seconds + " hour";
    } else if (minutes >= 2 && minutes < 60) {
        document.querySelector('#estTime').value = "Estimated time: 00:" + minutes + ":" + seconds + " minutes";
    } else if (minutes == 1) {
        document.querySelector('#estTime').value = "Estimated time: 00:" + minutes + ":" + seconds + " minute";
    } else if (seconds >= 2 && seconds < 60) {
        document.querySelector('#estTime').value = "Estimated time: 00:00:" + seconds + " seconds";
    } else if (seconds == 0) {
        document.querySelector('#estTime').value = "Estimated time: 00:00:" + seconds + " seconds";
    } else {
        document.querySelector('#estTime').value = "Estimated time: 00:00:" + seconds + " second";
    }
}

const data = [];

function xcsrf() {
    fetch("https://0your-freshdesk-url.com/api/_/bootstrap/me.json")
        .then(function(response) {
            return response.json()
        })
        .then(function(response) {
            csrf = response.meta.csrf_token
            document.getElementById('x-csrf-token').value = csrf;
            parse();
        })
}

function parse() {
    const csrf = document.getElementById('x-csrf-token').value;
    const prio = document.querySelector('input[name = Priority]:checked').value;
    const status = document.querySelector('input[name = Status]:checked').value;
    const agent = document.getElementById('agents').value;
    const response = document.getElementById('ticket-response').value.replace(/&/g, "and"); //'&' in a response makes the code omit everything after it

    data.splice(0, data.length);
    localStorage.setItem('data', '[]');

    if(localStorage.getItem('data') == null) {
        localStorage.setItem('data', '[]');
    }

    var old_data = JSON.parse(localStorage.getItem('data'));

    old_data.push(csrf,prio,status,agent,response);
    localStorage.setItem('data', JSON.stringify(old_data));
    data.push(old_data);
    options(0);
}

/*
data2[i]   = current Ticket ID
data[0][0] = csrf
data[0][1] = prio
data[0][2] = status
data[0][3] = agent
data[0][4] = response
*/

let responseSubject = "";
let responseDescription = "";

function options(i) {
    if (i<data2.length) {
        if(data[0][4]){
            setTimeout(async function() {
                await Promise.all([
                    fetch("https://0your-freshdesk-url.com/tickets/" + data2[i] + ".json")
                        .then(function(response) {
                            return response.json()
                        })
                        .then(function(response) {
                            responseSubject = response.helpdesk_ticket.subject.replace(/&/g, "and");
                            responseDescription = response.helpdesk_ticket.description.replace(/&/g, "and");
                            fetch("https://0your-freshdesk-url.com/tickets/" + data2[i] + "/conversations/reply", {
                                "headers": {
                                    "accept": "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01",
                                    "accept-language": "en,fr-FR;q=0.9,fr;q=0.8,de-DE;q=0.7,de;q=0.6,en-US;q=0.5,pl;q=0.4,nl;q=0.3,fy;q=0.2",
                                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "same-origin",
                                    "x-csrf-token": data[0][0],
                                    "x-requested-with": "XMLHttpRequest"
                                },
                                "referrer": "https://0your-freshdesk-url.com/tickets/" + data2[i],
                                "referrerPolicy": "strict-origin-when-cross-origin",
                                "body": "utf8=%E2%9C%93&include_cc=on&reply_email[id]=%22NAME+OF+EMAIL+SENDING+THE+REPLY+FROM%22+<EMAIL_SENDING_THE_REPLY_FROM@EMAILDOMAIN.com>&helpdesk_note[cc_emails][]=" + response.helpdesk_ticket.cc_email.tkt_cc[0] + "&helpdesk_note[note_body_attributes][body_html]=<div+style=%22font-size:+14px;+font-family:+-apple-system%2C+BlinkMacSystemFont%2C+%26quot;Segoe+UI%26quot;%2C+Roboto%2C+%26quot;Helvetica+Neue%26quot;%2C+Arial%2C+sans-serif;%22><p></p><div><p>Hello " + response.helpdesk_ticket.requester_name + "%2C<br></p><p><br>Ticket:+https://0your-freshdesk-url0.com/tickets/" + data2[i] + "<br></p>%0A<br><p>" + data[0][4] + "</p><p><br></p><p>KR</p><p><br></p><p>YOUR+NAME+AS+FAREWELL+EXPRESSION</p><p><br></p><div class=\"freshdesk_quote\">\r\n<blockquote class=\"freshdesk_quote\"><p>On " + response.helpdesk_ticket.created_at + "<span class=\"separator\">\r\n, " + response.helpdesk_ticket.requester_name + " <" + response.helpdesk_ticket.cc_email.tkt_cc[0] + "> wrote:</div><div><br><br><b>" + responseSubject + "</b><div><br></div>" + responseDescription + "</p></div></span></blockquote></div><p><br></p>%0A</div>%0A</div>%0A+++++++</div>&helpdesk_note[bcc_emails]=&helpdesk_note[private]=false&helpdesk_note[source]=0&helpdesk_note[from_email]=%22NAME+OF+EMAIL+SENDING+THE+REPLY+FROM%22+<EMAIL_SENDING_THE_REPLY_FROM@EMAILDOMAIN.com>&helpdesk_note[email_config_id]=YOUR_EMAIL_ID&add_notes_to_related_tickets[value]=0&redactor_image_field=%22[]%22&format=js&showing=notes",
                                "method": "POST",
                                "mode": "cors",
                                "credentials": "include"
                            })
                            fetch("https://0your-freshdesk-url.com/tickets/" + data2[i] + "/update_ticket_properties", {
                                "headers": {
                                    "accept": "application/json, text/javascript, */*; q=0.01",
                                    "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
                                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "same-origin",
                                    "x-csrf-token": data[0][0],
                                    "x-requested-with": "XMLHttpRequest"
                                },
                                "referrer": "https://0your-freshdesk-url.com/tickets/" + data2[i],
                                "referrerPolicy": "no-referrer-when-downgrade",
                                "body": "utf8=%E2%9C%93&_method=put&helpdesk_ticket[priority]=" + data[0][1] + "&helpdesk_ticket[status]=" + data[0][2] + "&    helpdesk_ticket[responder_id]=" + data[0][3],
                                "method": "POST",
                                "mode": "cors",
                                "credentials": "include"
                            })
                            setTimeout(console.log.bind(console, ([i+1] + " - Ticket ID: " + data2[i] + " - Current Cc: " + response.helpdesk_ticket.cc_email.  tkt_cc)))
                        })
                ])
                .catch(function(error) {
                    setTimeout(console.log.bind(console, "Fehler: ", error));
                    document.getElementById('submit').disabled = false;
                    document.getElementById('estTime').style.backgroundColor = 'red';
                    if (i=bad) {
                        return;
                    }
                    return i=bad;                    
                })
                i++;
                options(i);
            }, 250);
        } else {
            setTimeout(console.log.bind(console, ([i+1] + " - Ticket ID: " + data2[i])));
            setTimeout(async function() {
                fetch("https://0your-freshdesk-url.com/tickets/" + data2[i] + "/update_ticket_properties", {
                    "headers": {
                        "accept": "application/json, text/javascript, */*; q=0.01",
                        "accept-language": "de-DE;q=0.7,de;q=0.6,en-US;q=0.5",
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-csrf-token": data[0][0],
                        "x-requested-with": "XMLHttpRequest"
                    },
                    "referrer": "https://0your-freshdesk-url.com/tickets/" + data2[i],
                    "referrerPolicy": "no-referrer-when-downgrade",
                    "body": "utf8=%E2%9C%93&_method=put&helpdesk_ticket[priority]=" + data[0][1] + "&helpdesk_ticket[status]=" + data[0][2] + "&helpdesk_ticket [responder_id]=" + data[0][3],
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                })
                .catch(function(error) {
                    setTimeout(console.log.bind(console, "Fehler: ", error));
                    document.getElementById('submit').disabled = false;
                    document.getElementById('estTime').style.backgroundColor = 'red';
                    if (i=bad) {
                        return;
                    }
                    return i=bad;
                })
                i++;
                options(i);
            }, 50);
        }
    }
    if (i>=data2.length) {
        document.getElementById('submit').disabled = false;
        document.getElementById('estTime').style.backgroundColor = 'lightgreen';
    }
}