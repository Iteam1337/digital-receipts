const express = require('express')
const app = express()
const port = 7900
const moment = require('moment')
const staticMails = require('./assets/staticMails')
const qrcode = require('qrcode')
const fs = require('fs')
require('dotenv').config({
    path: process.cwd() + '/../.env'
})
const got = require('got')

app.use(require('body-parser').json())
let receipts = []

function beautifulNewReceipt(r, elementIndex) {
    return `
    <tr ${elementIndex === 0 ? `data-step="1" data-intro="Klicka för att öppna mailet med ditt ditt kvitto"` : ""}  class="unread" onclick='openReceipt(${JSON.stringify(r)})'>
      <td class="inbox-small-cells">
          <input type="checkbox" class="mail-checkbox">
      </td>
      <td class="inbox-small-cells"><i class="fa fa-star"></i></td>
      <td class="view-message dont-show">${r.receipt.shopName}</td>
      <td class="view-message">Tack för din beställning NULL NULL</td>
      <td class="view-message inbox-small-cells"></td>
      <td class="view-message text-right">${moment(r.receipt.receiptDateTime).format('HH:mm')}</td>
  </tr>
  `
}

function openReceipt(r) {
    const {
        receipt
    } = r
    const receiptJson = JSON.stringify(r)
    const receiptHtml = `
        <h2>${receipt.shopName}</h2>
        <ul>
            ${Object.keys(receipt)
              .map(k => `<li>${k} : ${JSON.stringify(receipt[k])}</li>`)
              .join('')}
        </ul>
        <pre data-step="1" data-intro-group="opened" data-intro="Det här är rådatan till ditt kvitto. </br> </br> Nästa steg är att vidarebefodra datan till ekonomisystemet, för att kostnadsföra kvittot.">${JSON.stringify(r, null, 2)}</pre>
        <canvas id="canvas"></canvas>
        <input style="display: block;" type="button" value="Ladda ner" onclick='downloadReceipt(${receiptJson})'/>
        <br/>
        <ul class="email-actions">
            <li><input type="button" value="Reply"/></li>
            <li><input type="button" value="Reply all"/></li>
            <li data-intro="Klicka här för att vidarebefodra kvittot" id="forward-btn"><a onclick='forwardReceipt(${receiptJson})' class="btn mini btn-info">
                    Forward
            </a></li>
        </ul>
    `
    document.getElementById('email-container').innerHTML = receiptHtml
    QRCode.toCanvas(document.getElementById('canvas'), receiptJson)
    intro.exit()
    setTimeout(() => {
        intro.start()
    }, 1000);
}

function forwardReceipt(r) {
    const result = prompt('To', 'kvitton@ekonomi.se')
    if (result) {
        intro.nextStep()
        fetch(`/forward`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(r)
        })
    }
}

app.post('/forward', async (req, res) => {
    await got(`${process.env.USER_ACCOUNTING_URL}/receipts`, {
        json: true,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: {
            ...req.body
        }
    })
    res.send(200)
})

app.post('/emails', (req, res) => {
    receipts.unshift({
        ...req.body,
        date: moment().format('HH:mm')
    })
    res.sendStatus(200)
})
app.get('/emails', (req, res) => {
    res.send(`
<head>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
    <link rel="stylesheet" type="text/css" href="/intro.js/introjs.css"/>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.0/js/bootstrap.min.js"></script>
    <script src="https://code.jquery.com/jquery-1.11.1.min.js"></script>
    <h2 id="window-title">Mottagar-fönster för butikskunden</h2>
    <link rel="stylesheet" type="text/css" href="newcss.css" />
    <script src="https://qrcode/build/qrcode.min.js"></script>
    <script type="text/javascript">
      var openReceipt = ${eval(openReceipt)}
      var forwardReceipt = ${eval(forwardReceipt)}
    </script>
</head>

<div class="container">
    <link rel='stylesheet prefetch' href='https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css'>
    <div class="mail-box">
        <aside class="sm-side">
            <div class="user-head">
                <div class="user-name">
                    <h5><a href="#">Null Null</a></h5>
                    <span><a href="#">null@fakemail.com</a></span>
                </div>
                <a class="mail-dropdown pull-right" href="javascript:;">
                    <i class="fa fa-chevron-down"></i>
                </a>
            </div>
            <div class="inbox-body">
                <a href="#myModal" data-toggle="modal" title="Compose" class="btn btn-compose">
                    Compose
                </a>
                <!-- Modal -->
                <div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="myModal"
                    class="modal fade" style="display: none;">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button aria-hidden="true" data-dismiss="modal" class="close" type="button">×</button>
                                <h4 class="modal-title">Compose</h4>
                            </div>
                            <div class="modal-body">
                                <form role="form" class="form-horizontal">
                                    <div class="form-group">
                                        <label class="col-lg-2 control-label">To</label>
                                        <div class="col-lg-10">
                                            <input type="text" placeholder="" id="inputEmail1" class="form-control">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-lg-2 control-label">Cc / Bcc</label>
                                        <div class="col-lg-10">
                                            <input type="text" placeholder="" id="cc" class="form-control">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-lg-2 control-label">Subject</label>
                                        <div class="col-lg-10">
                                            <input type="text" placeholder="" id="inputPassword1" class="form-control">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-lg-2 control-label">Message</label>
                                        <div class="col-lg-10">
                                            <textarea rows="10" cols="30" class="form-control" id="" name=""></textarea>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <div class="col-lg-offset-2 col-lg-10">
                                            <span class="btn green fileinput-button">
                                                <i class="fa fa-plus fa fa-white"></i>
                                                <span>Attachment</span>
                                                <input type="file" name="files[]" multiple="">
                                            </span>
                                            <button class="btn btn-send" type="submit">Send</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div><!-- /.modal-content -->
                    </div><!-- /.modal-dialog -->
                </div><!-- /.modal -->
            </div>
            <ul class="inbox-nav inbox-divider">
                <li class="active">
                    <a href="#"><i class="fa fa-inbox"></i> Inbox <span
                            class="label label-danger pull-right">2</span></a>

                </li>
                <li>
                    <a href="#"><i class="fa fa-envelope-o"></i> Sent Mail</a>
                </li>
                <li>
                    <a href="#"><i class="fa fa-bookmark-o"></i> Important</a>
                </li>
                <li>
                    <a href="#"><i class=" fa fa-external-link"></i> Drafts <span
                            class="label label-info pull-right">30</span></a>
                </li>
                <li>
                    <a href="#"><i class=" fa fa-trash-o"></i> Trash</a>
                </li>
            </ul>
            <ul class="nav nav-pills nav-stacked labels-info inbox-divider">
                <li>
                    <h4>Labels</h4>
                </li>
                <li> <a href="#"> <i class=" fa fa-sign-blank text-danger"></i> Work </a> </li>
                <li> <a href="#"> <i class=" fa fa-sign-blank text-info "></i> Family </a>
                </li>
                <li> <a href="#"> <i class=" fa fa-sign-blank text-warning "></i> Friends </a>
                </li>
                <li> <a href="#"> <i class=" fa fa-sign-blank text-primary "></i> Office </a>
                </li>
            </ul>

            <div class="inbox-body text-center">
                <div class="btn-group">
                    <a class="btn mini btn-primary" href="javascript:;">
                        <i class="fa fa-plus"></i>
                    </a>
                </div>
                <div class="btn-group">
                    <a class="btn mini btn-success" href="javascript:;">
                        <i class="fa fa-phone"></i>
                    </a>
                </div>
                <div class="btn-group">
                    <a class="btn mini btn-info" href="javascript:;">
                        <i class="fa fa-cog"></i>
                    </a>
                </div>
            </div>

        </aside>
        <aside class="lg-side">
            <div class="inbox-head">
                <h3>Inbox</h3>
                <form action="#" class="pull-right position">
                    <div class="input-append">
                        <input type="text" class="sr-input" placeholder="Search Mail">
                        <button class="btn sr-btn" type="button"><i class="fa fa-search"></i></button>
                    </div>
                </form>
            </div>
            <div class="inbox-body">
                <div class="mail-option">
                    <div class="chk-all">
                        <input type="checkbox" class="mail-checkbox mail-group-checkbox">
                        <div class="btn-group">
                            <a data-toggle="dropdown" href="#" class="btn mini all" aria-expanded="false">
                                All
                                <i class="fa fa-angle-down "></i>
                            </a>
                            <ul class="dropdown-menu">
                                <li><a href="#"> None</a></li>
                                <li><a href="#"> Read</a></li>
                                <li><a href="#"> Unread</a></li>
                            </ul>
                        </div>
                    </div>

                    <div class="btn-group">
                        <a data-original-title="Refresh" data-placement="top" data-toggle="dropdown" href="/emails"
                            class="btn mini tooltips">
                            <i class=" fa fa-refresh"></i>
                        </a>
                    </div>
                    <div class="btn-group hidden-phone">
                        <a data-toggle="dropdown" href="#" class="btn mini blue" aria-expanded="false">
                            More
                            <i class="fa fa-angle-down "></i>
                        </a>
                        <ul class="dropdown-menu">
                            <li><a href="#"><i class="fa fa-pencil"></i> Mark as Read</a></li>
                            <li><a href="#"><i class="fa fa-ban"></i> Spam</a></li>
                            <li class="divider"></li>
                            <li><a href="#"><i class="fa fa-trash-o"></i> Delete</a></li>
                        </ul>
                    </div>
                    <div class="btn-group">
                        <a data-toggle="dropdown" href="#" class="btn mini blue">
                            Move to
                            <i class="fa fa-angle-down "></i>
                        </a>
                        <ul class="dropdown-menu">
                            <li><a href="#"><i class="fa fa-pencil"></i> Mark as Read</a></li>
                            <li><a href="#"><i class="fa fa-ban"></i> Spam</a></li>
                            <li class="divider"></li>
                            <li><a href="#"><i class="fa fa-trash-o"></i> Delete</a></li>
                        </ul>
                    </div>

                    <ul class="unstyled inbox-pagination">
                        <li><span></span></li>
                        <li>
                            <a class="np-btn" href="#"><i class="fa fa-angle-left  pagination-left"></i></a>
                        </li>
                        <li>
                            <a class="np-btn" href="#"><i class="fa fa-angle-right pagination-right"></i></a>
                        </li>
                    </ul>
                </div>
                <table class="table table-inbox table-hover">
                    <tbody>
                        ${receipts.map(beautifulNewReceipt).join('')}
                        <tr class="unread">
                            <td class="inbox-small-cells">
                                <input type="checkbox" class="mail-checkbox">
                            </td>
                            <td class="inbox-small-cells"><i class="fa fa-star"></i></td>
                            <td class="view-message  dont-show">Javascript Class</td>
                            <td class="view-message ">Learn how to program Javascript in 30..</td>
                            <td class="view-message  inbox-small-cells"><i class="fa fa-paperclip"></i></td>
                            <td class="view-message  text-right">9:27 AM</td>
                        </tr>
                        <tr class="unread">
                            <td class="inbox-small-cells">
                                <input type="checkbox" class="mail-checkbox">
                            </td>
                            <td class="inbox-small-cells"><i class="fa fa-star"></i></td>
                            <td class="view-message dont-show">Nordic JS </td>
                            <td class="view-message">Only 50 Regular Bird Tickets left </td>
                            <td class="view-message inbox-small-cells"></td>
                            <td class="view-message text-right">March 15</td>
                        </tr>
                    </tbody>
                </table>
                <div id="email-container"></div>
            </div>
        </aside>
    </div>
</div>
<script type="text/javascript" src="/intro.js/intro.js"></script>
<script type="text/javascript">
    const urlParams = new URLSearchParams(window.location.search)

    const intro = introJs()
    intro.setOptions({'hidePrev': true, 'hideNext': true, 'showStepNumbers': false, 'skipLabel': 'Hoppa över demonstration', 'doneLabel': 'Till butikskundens företags affärssystem', 'nextLabel': 'Nästa'})
    if (urlParams.has('tutorial')) {
        setTimeout(() => {
            intro.start().oncomplete(function() {
                window.location.href = '${process.env.USER_ACCOUNTING_URL_EXT}/expenses?tutorial=true';
            });
        }, 1000)
    }
</script>
  `)
})

app.use(express.static('node_modules'))
app.use(express.static('public'))
app.get('/', (_, res) => res.redirect('/emails'))
app.listen(port, () => console.log(`User interface running on ${port}!`))