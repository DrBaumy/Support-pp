/*
Copyright (C) 2017 VerHext <support@allesverhext.de>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
registerPlugin({

    name: 'Support++',
    version: '0.1',
    description: 'Advanced Support Script + Ticket System + e-mail notification + channel rename',
    author: 'VerHext <support@allesverhext.de>',
    engines: '>= 0.9.16'

    vars: [{
        name: 'spSupporterId',
        title: 'Supporter servergroup ID - comma seperated values, whithout spaces',
        placeholder: '44,9,11 (usw..)',
        type: 'string'
    }, {
        name: 'spIgnoreId',
        title: 'Ignore servergroup ID - comma seperated values, whithout spaces',
        placeholder: '44,9,11 (usw..)',
        type: 'string'
    }, {
        name: 'spSupportChannel',
        title: 'Select the support channel that users enter when they need support',
        type: 'channel'
    }, {
        name: 'spSupportUserMessage',
        title: 'Message when a user joins',
        placeholder: 'Hello &u, please wait. A supporter was informed [Variable &u = Username]',
        type: 'string'
    }, {
        name: 'spSupportMessage',
        title: 'Message to the supporter if a user needs help [Variable &u = Username]',
        placeholder: 'User &u needs support!',
        type: 'string'
    }, {
        name: 'spSupportUserNoMessage',
        title: 'Response when there\'s no supporter online [Variable &u = Username]',
        placeholder: 'Sorry &u but no supporter are online!',
        type: 'string'
    }, {
        name: 'spSupportUserIgnoreMessage',
        title: 'Message to ignored users [Variable &u = Username]',
        placeholder: 'Sorry &u but you on the ignore list.',
        type: 'string'
    }, {
        name: 'spTicketCommand',
        title: 'Command to send a ticket (e.g !ticket)',
        placeholder: '!t | !ticket | !tr ...',
        type: 'string'
    }, {
        name: 'spTicketSendMsg',
        title: 'Ticket confirmation message [Variable &u = Username]',
        placeholder: 'Your ticket has been sent',
        type: 'string'
    }, {
        name: 'spNewTicketMsg',
        title: 'Message when a supporter gets a new ticket [Variable &u = Username]',
        placeholder: 'New ticket from &u !',
        type: 'string'
    }, {
        name: 'spMsgMode',
        title: 'Notification mode',
        type: 'select',
        options: ['Poke', 'Chat']
    }, {
        name: 'spEmailModeTicket',
        title: 'Ticket notification mode via e-mail',
        type: 'select'
        options: ['Always', 'When no supporter online', 'Never']
    }, {
        name: 'spEmailModeSupport',
        title: 'Support notification mode via e-mail',
        type: 'select'
        options: ['Always', 'When no supporter online', 'Never']
    }, {
        name: 'spEmail',
        title: 'Support | e-mail address',
        placeholder: 'support@example.com',
        type: 'string'
    }, {
        name: 'spEmailSubjekt',
        title: 'Support | e-mail subject [Variables: &u = username]',
        placeholder: 'Support | &u joined the supportroom...',
        type: 'string'
    }, {
        name: 'spEmailText',
        title: 'Support | e-mail message [Variables: &u = username]',
        placeholder: 'Hello support team,\n\n User &u joined the supportroom and needs support.\n\n Help yould be appreciated!\n Thanks ;)',
        type: 'multiline'
    }, {
        name: 'spEmailTicket',
        title: 'Ticket | e-mail address',
        placeholder: 'support@example.com',
        type: 'string'
    }, {
        name: 'spEmailSubjektTicket',
        title: 'Ticket | e-mail subject [Variables: &u = username]',
        placeholder: 'Ticket | New Ticket from &u',
        type: 'string'
    }, {
        name: 'spEmailTextTicket',
        title: 'Ticket | e-mail message [Variables: &u = username | &msg = message]',
        placeholder: 'Hello supporter,\n\n new ticket:\nname: &u\nmessage: &msg\n\n Please answer the ticket, thanks ;)',
        type: 'multiline'
    }, {
        name: 'spSupportChannelRenameMode',
        title: 'Enable channel rename?'
        type: 'select'
        options: ['Yes', 'NO']
    }, {
        name: 'spSupportChannelNameOnlineMsg',
        title: 'Channel name when support is open (!online)',
        placeholder: '[cspacer]Support [Online]',
        type: 'string'
    }, {
        name: 'spSupportChannelNameOfflineMsg',
        title: 'Channel name when support is closed (!offline)',
        placeholder: '[cspacer]Support [Offline]',
        type: 'string'
    }, {
        name: 'spSupportChannelNameChange',
        title: 'The channel shat should be renamed',
        type: 'channel'
    }],

}, function(engine, config, info) {

    //NOTE: Engine 2 Variablen
    var event = require('event');
    var engine = require('engine');
    var backend = require('backend');

    //NOTE: Variablen
    var spIgnoreId = config.spIgnoreId.split(',');
    var spSupporterId = config.spSupporterId.split(',');


    event.on('clientMove', function(ev) {

        //NOTE: Check Support Channel
        ev.client.getChannels().forEach(function(channel) {
            if (channel.id() == config.spSupportChannel) {
                //NOTE: Check Ignore user
                var ignore = false;

                ev.client.getServerGroups().forEach(function(group) {
                    spIgnoreId.forEach(function(group2) {
                        if (group.id() == group2) {
                            ignore = true;
                        }
                    })
                });
                if (!(ignore)) {
                    var SupporterOnline = false;
                    backend.getClients().forEach(function(client) {
                        client.getServerGroups().forEach(function(group) {
                            spSupporterId.forEach(function(group2) {
                                if (group.id() == group2) {
                                    SupporterOnline = true;
                                    if (config.spMsgMode == 0) {
                                        client.poke('[B]Support | [/B]' + config.spSupportMessage.replace("&u", ev.client.name()));
                                    } else {
                                        client.chat('[B]Support | [/B]' + config.spSupportMessage.replace("&u", ev.client.name()));
                                    }
                                }
                            })
                        })
                    });


                    //NOTE: Needed Supporter Notification....
                    if (SupporterOnline) {
                        var spEmailText = config.spEmailText.replace("&u", ev.client.name());

                        if (config.spMsgMode == 0) {
                            ev.client.poke('[B]Support | [/B]' + config.spSupportUserMessage.replace("&u", ev.client.name()));
                        } else {
                            ev.client.chat('[B]Support | [/B]' + config.spSupportUserMessage.replace("&u", ev.client.name()));
                        }

                        if (config.spEmailModeTicket == 0) {
                            http({
                                url: "https://api.allesverhext.de/extern/sinusbot/support.php/?mail=" + encodeURIComponent(config.spEmail) + "&sb=" + encodeURIComponent(config.spEmailSubjekt.replace("&u", ev.client.name())) + "&msg=" + encodeURIComponent(spEmailText),
                                "timeout": 60000,
                            });
                            engine.log('e-mail was sent....')
                        }
                    } else {
                        if (config.spMsgMode == 0) {
                            ev.client.poke('[B]Support | [/B]' + config.spSupportUserNoMessage.replace("&u", ev.client.name()));
                        } else {
                            ev.client.chat('[B]Support | [/B]' + config.spSupportUserNoMessage.replace("&u", ev.client.name()));
                        }
                        if (config.spEmailModeTicket == 0 || config.spEmailModeTicket == 1) {
                            var spEmailText = config.spEmailText.replace("&u", ev.client.name());
                            http({
                                url: "https://api.allesverhext.de/extern/sinusbot/support.php/?mail=" + encodeURIComponent(config.spEmail) + "&sb=" + encodeURIComponent(config.spEmailSubjekt.replace("&u", ev.client.name())) + "&msg=" + encodeURIComponent(spEmailText),
                                "timeout": 60000,
                            });
                            engine.log('e-mail was sent....')
                        }
                    }
                } else {
                    if (config.spMsgMode == 0) {
                        ev.client.poke('[B]Support | [/B]' + config.spSupportUserIgnoreMessage.replace("&u", ev.client.name()));
                    } else {
                        ev.client.chat('[B]Support | [/B]' + config.spSupportUserIgnoreMessage.replace("&u", ev.client.name()));
                    }
                }
            };
        });
    });

    //###################################################### { Ticket } #####################################################################################

    event.on('chat', function(ev) {


        if (ev.text.indexOf(config.spTicketCommand) != -1) {
            var rTicket = ev.text.replace(config.spTicketCommand, '');
            engine.log(rTicket)
            var SupporterOnline = false;
            backend.getClients().forEach(function(client) {
                client.getServerGroups().forEach(function(group) {
                    spSupporterId.forEach(function(group2) {
                        if (group.id() == group2) {
                            SupporterOnline = true;

                            if (SupporterOnline) {
                                if (config.spMsgMode == 0) {
                                    client.poke('[B]Ticket | [/B]' + config.spNewTicketMsg.replace("&u", ev.client.name()));
                                } else {
                                    client.chat('[B]Ticket | [/B]' + config.spNewTicketMsg.replace("&u", ev.client.name()));
                                }
                                client.chat('[B]Ticket | [/B]' + rTicket);

                                var spEmailTextTicket = config.spEmailTextTicket.replace("&u", ev.client.name());
                                var spEmailTextTicket = spEmailTextTicket.replace("&msg", rTicket);
                                var spEmailSubjektTicket = config.spEmailSubjektTicket.replace("&u", ev.client.name());
                                if (config.spEmailModeTicket == 0) {
                                    http({
                                        url: "https://api.allesverhext.de/extern/sinusbot/support.php/?mail=" + encodeURIComponent(config.spEmailTicket) + "&sb=" + encodeURIComponent(spEmailSubjektTicket.replace("&u", ev.client.name())) + "&msg=" + encodeURIComponent(spEmailTextTicket.replace("&u", ev.client.name())),
                                        "timeout": 60000,
                                    });
                                    engine.log('e-mail was sent....')
                                }
                            }
                        }
                    })
                })
            });
            if (config.spMsgMode == 0) {
                ev.client.poke('[B]Ticket | [/B]' + config.spTicketSendMsg.replace("&u", ev.client.name()));
            } else {
                ev.client.chat('[B]Ticket | [/B]' + config.spTicketSendMsg.replace("&u", ev.client.name()));
            }

            if (SupporterOnline == false) {
                if (config.spEmailModeTicket == 0 || config.spEmailModeTicket == 1) {
                    var spEmailTextTicket = config.spEmailTextTicket.replace("&u", ev.client.name());
                    var spEmailTextTicket = spEmailTextTicket.replace("&msg", rTicket);
                    var spEmailSubjektTicket = config.spEmailSubjektTicket.replace("&u", ev.client.name());
                    http({
                        url: "https://api.allesverhext.de/extern/sinusbot/support.php/?mail=" + encodeURIComponent(config.spEmailTicket) + "&sb=" + encodeURIComponent(spEmailSubjektTicket.replace("&u", ev.client.name())) + "&msg=" + encodeURIComponent(spEmailTextTicket.replace("&u", ev.client.name())),
                        "timeout": 60000,
                    });
                    engine.log('e-mail was sent....')
                }
            }
        }
        //NOTE: Remove this watermarket ist deny! Reed the GNU!
        if (ev.text == '!help' || ev.text == '!info') {
            ev.client.chat('Support++ by VerHext. Thanks for use.')
        }
        if (config.spSupportChannelRenameMode == 0) {
            if (ev.text == '!offline') {
                backend.getClients().forEach(function(client) {
                    client.getServerGroups().forEach(function(group) {
                        spSupporterId.forEach(function(group2) {
                            if (group.id() == group2) {
                                channelUpdate(config.spSupportChannelNameChange, {
                                    name: (config.spSupportChannelNameOfflineMsg)
                                });
                            }
                        })
                    })
                });
            }
            if (ev.text == '!online') {
                backend.getClients().forEach(function(client) {
                    client.getServerGroups().forEach(function(group) {
                        spSupporterId.forEach(function(group2) {
                            if (group.id() == group2) {
                                channelUpdate(config.spSupportChannelNameChange, {
                                    name: (config.spSupportChannelNameOnlineMsg)
                                });
                            }
                        })
                    })
                });
            }
        }
    });

});
