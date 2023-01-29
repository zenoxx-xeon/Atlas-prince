require("./index.js");
require("./config.js");
require("./BotCharacters.js");
const {
  generateWAMessage,
  areJidsSameUser,
  proto,
} = require("@adiwajshing/baileys");
const { Simple, Collection, Function } = require("./lib");
const { isUrl, isNumber } = Function;
const {
  smsg,
  formatp,
  tanggal,
  GIFBufferToVideoBuffer,
  formatDate,
  getTime,
  sleep,
  clockString,
  runtime,
  fetchJson,
  getBuffer,
  jsonformat,
  format,
  parseMention,
  getRandom,
} = require("./lib/myfunc");
const Func = require("./lib");
const fs = require("fs");
const moment = require("moment-timezone");
const chalk = require("chalk");
const { color } = require("./lib/color");
//const { correct } = require("./lib/Correct")
const { QuickDB, MySQLDriver } = require("quick.db");
const { Console } = require("console");
const cool = new Collection();
const { mk, mku, mkchar } = require("./Database/dataschema.js");
const prefix = global.prefa;

const db = new QuickDB();
/*(async () => {
    const mysqlDriver = new MySQLDriver({
        host: "localhost:3306",
        user: "root",
        password: "74325252",
        database: "miku_db",
    });
    await mysqlDriver.connect(); // connect to the database **this is important**

    const db = new QuickDB({ driver: mysqlDriver });
    // Now you can use quick.db as normal

    await db.set("userInfo", { difficulty: "Easy" });
    // -> { difficulty: 'Easy' }
})();
*/

global.Levels = require("discord-xp");
Levels.setURL(
  "mongodb+srv://fantox001:zjmbvgwr52@cluster0.qh05pl9.mongodb.net/?retryWrites=true&w=majority"
);

console.log(color("\nDatabase has been connected Successfully !", "aqua"));

//const CurrencySystem = require("currency-system");
//global.cs = new CurrencySystem;

module.exports = async (Miku, m, commands, chatUpdate, store) => {
  try {
    let { type, isGroup, sender, from } = m;
    let body =
      type == "buttonsResponseMessage"
        ? m.message[type].selectedButtonId
        : type == "listResponseMessage"
        ? m.message[type].singleSelectReply.selectedRowId
        : type == "templateButtonReplyMessage"
        ? m.message[type].selectedId
        : m.text;

    let prat =
      type === "conversation" && body?.startsWith(prefix)
        ? body
        : (type === "imageMessage" || type === "videoMessage") &&
          body &&
          body?.startsWith(prefix)
        ? body
        : type === "extendedTextMessage" && body?.startsWith(prefix)
        ? body
        : type === "buttonsResponseMessage" && body?.startsWith(prefix)
        ? body
        : type === "listResponseMessage" && body?.startsWith(prefix)
        ? body
        : type === "templateButtonReplyMessage" && body?.startsWith(prefix)
        ? body
        : "";

    const metadata = isGroup ? await Miku.groupMetadata(from) : {};
    const pushname = m.pushName; //|| 'NO name'
    const participants = isGroup ? metadata.participants : [sender];
    const groupAdmin = isGroup
      ? participants.filter((v) => v.admin !== null).map((v) => v.id)
      : [];
    const botNumber = await Miku.decodeJid(Miku.user.id);
    const isBotAdmin = m.isGroup ? groupAdmin.includes(Miku.user?.jid) : false;
    const isAdmin = isGroup ? groupAdmin.includes(sender) : false;
    const isCreator = [botNumber, ...global.owner]
      .map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
      .includes(m.sender);
    const isOwner = global.owner.includes(m.sender);

    //////////Database\\\\\\\\\\\\\\\\s

    await db.push("userInfo.mods", global.owner);
    var mikuModsList = await db.get("userInfo.mods");
    /*
        if(mikuModsList.includes(m.sender.num)){
            console.log("Miku is a mod");
        }
        else{
            console.log("Miku is not a mod");
        };

        /*
        const _mods = await db.get('mods')
        const mods = _mods || []
        const _ban= await db.get("ban")
        global.ban=_ban|| []
        const _nsfw=await db.get("nsfw")
        global.nsfw=_nsfw||[]
        let wel= await db.get("events")
        global.wlc = wel || []*/

    const isCmd = body.startsWith(prefix);
    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || m.msg).mimetype || " ";
    const isMedia = /image|video|sticker|audio/.test(mime);
    const budy = typeof m.text == "string" ? m.text : "";
    const args = body.trim().split(/ +/).slice(1);
    const ar = args.map((v) => v.toLowerCase());
    let text = (q = args.join(" "));
    const groupName = m.isGroup ? metadata.subject : ''
    const cmdName = prat
      .slice(prefix.length)
      .trim()
      .split(/ +/)
      .shift()
      .toLowerCase();

    const cmd =
      commands.get(cmdName) ||
      Array.from(commands.values()).find((v) =>
        v.alias.find((x) => x.toLowerCase() == cmdName)
      ) ||
      "";
    const icmd =
      commands.get(cmdName) ||
      Array.from(commands.values()).find((v) =>
        v.alias.find((x) => x.toLowerCase() == cmdName)
      );
    const mentionByTag =
      type == "extendedTextMessage" &&
      m.message.extendedTextMessage.contextInfo != null
        ? m.message.extendedTextMessage.contextInfo.mentionedJid
        : [];
    //if (body.startsWith(prefix) && !icmd) return Miku.sendMessage(m.from, { text: "Baka no such command" },{quoted:m})

    if (!isCreator) {
      let checkban =
        (await mku.findOne({ id: m.sender })) ||
        (await new mku({ id: m.sender, name: m.pushName }).save());
      if (isCmd && checkban.ban !== "false") return m.reply(mess.banned);
    }

    // --------------- Character Configuration (Do not modify this part) --------------- //

    let char = "0"; // default one
    let CharacterSelection = "0"; // user selected character
    await mkchar.findOne({ id: "1" }).then(async (res) => {
      if (res.seletedCharacter != char) {
        CharacterSelection = res.seletedCharacter;
      } else {
        CharacterSelection = char;
      }
    });

    let idConfig = "charID" + CharacterSelection;

    global.botName = global[idConfig].botName;
    global.botVideo = global[idConfig].botVideo;
    global.botImage1 = global[idConfig].botImage1;
    global.botImage2 = global[idConfig].botImage2;
    global.botImage3 = global[idConfig].botImage3;
    global.botImage4 = global[idConfig].botImage4;
    global.botImage5 = global[idConfig].botImage5;
    global.botImage6 = global[idConfig].botImage6;

    //-----------------------------------------------------------------------------------//

    let checkdata = await mk.findOne({ id: m.from });
    if (checkdata) {
      let mongoschema = checkdata.antilink || "false";
      if (m.isGroup && mongoschema == "true") {
        linkgce = await Miku.groupInviteCode(from);
        if (budy.includes(`https://chat.whatsapp.com/${linkgce}`)) {
          m.reply(
            `\`\`\`「  Antilink System  」\`\`\`\n\nNo action will be taken because you sent this group's link.`
          );
        } else if (isUrl(m.text)) {
          bvl = `\`\`\`「  Antilink System  」\`\`\`\n\nAdmin has sent a link so no issues.`;
          if (isAdmin) return m.reply(bvl);
          if (m.key.fromMe) return m.reply(bvl);
          if (isCreator) return m.reply(bvl);
          kice = m.sender;
          await Miku.groupParticipantsUpdate(m.from, [kice], "remove");
          await mk.updateOne({ id: m.from }, { antilink: "true" });
          Miku.sendMessage(
            from,
            {
              text: `\`\`\`「  Antilink System  」\`\`\`\n\n@${
                kice.split("@")[0]
              } Removed for sending link in this group!`,
              contextInfo: { mentionedJid: [kice] },
            },
            { quoted: m }
          );
        } else {
        }
      }
    }

    if (body === `${prefix}unbangc`) {
        mku.findOne({id:m.sender}).then(async (user) => {
            if (user.addedMods=="false" && !isCreator) {
                m.reply('Sorry, only my *Devs* and *Mods* can use this command !');
            } else {  
            if (!checkdata) {
                try {
                    await new mk({ id: m.from, bangroup: "false" }).save()
                    return m.reply(`*${global.botName} IS  UNBANNED ON ${groupName}*`)
                } catch (err) {
                    return m.reply(`An error occurred: ${err.message}`)
                }
            } else {
                if (checkdata.bangroup == "false") return m.reply(`ALREADY UNBANNED.`)
                try {
                    await mk.updateOne({ id: m.from }, { bangroup: "false" })
                    return m.reply(`*${global.botName} IS  UNBANNED ON ${groupName}*`)
                } catch (err) {
                    return m.reply(`An error occurred: ${err.message}`)
                 }
            }
       }}).catch(err => m.reply(`An error occurred: ${err.message}`))
    }

    
       if(m.isGroup && isCmd){
        if (!checkdata) {
            await new mk({ id: m.chat, bangroup: "true" }).save()
                        return reply(`*${global.botName} IS BANNED ON ${groupName}*`)
        }
        else {
            if (checkdata.bangroup == "true") return m.reply(`*${global.botName} IS BANNED ON ${groupName}*`)
        }     
    } 
    
    
    const flags = args.filter((arg) => arg.startsWith("--"));
    if (body.startsWith(prefix) && !icmd) {
      let mikutext = `No such command programmed *${pushname}* senpai! Type *${prefix}help* or press the button below to get my full command list!\n`;

      let Button = [
        {
          buttonId: `${prefix}help`,
          buttonText: { displayText: `${prefix}help` },
          type: 1,
        },
      ];
      let bmffg = {
        image: { url: botImage1 },
        caption: mikutext,
        footer: `*${botName}*`,
        buttons: Button,
        headerType: 4,
      };
      Miku.sendMessage(m.from, bmffg, { quoted: m });
    }

    if (m.message) {
      //  addBalance(m.sender, randomNomor(574), balance)
      console.log(
        chalk.black(chalk.bgWhite("[ MESSAGE ]")),
        chalk.black(chalk.bgGreen(new Date())),
        chalk.black(chalk.bgBlue(budy || m.mtype)) +
          "\n" +
          chalk.magenta("=> From"),
        chalk.green(pushname),
        chalk.yellow(m.sender) + "\n" + chalk.blueBright("=> In"),
        chalk.green(m.isGroup ? pushname : "Private Chat", m.chat)
      );
    }

    if (cmd) {
      const randomXp = Math.floor(Math.random() * 3) + 1; //Random amont of XP until the number you want + 1
      const haslUp = await Levels.appendXp(m.sender, "bot", randomXp);
    }
    if (
      text.endsWith("--info") ||
      text.endsWith("--i") ||
      text.endsWith("--?")
    ) {
      let data = [];
      if (cmd.alias) data.push(`*Alias :* ${cmd.alias.join(", ")}`);

      if (cmd.desc) data.push(`*Description :* ${cmd.desc}\n`);
      if (cmd.usage)
        data.push(
          `*Example :* ${cmd.usage
            .replace(/%prefix/gi, prefix)
            .replace(/%command/gi, cmd.name)
            .replace(/%text/gi, text)}`
        );
      var buttonss = [
        {
          buttonId: `${prefix}help`,
          buttonText: { displayText: `help` },
          type: 1,
        },
      ];
      let buttonmess = {
        text: `*Command Info*\n\n${data.join("\n")}`,
        footer: "Miku-MD",
        buttons: buttonss,
        headerType: 1,
      };
      let reactionMess = {
        react: {
          text: cmd.react,
          key: m.key,
        },
      };
      await Miku.sendMessage(m.from, reactionMess).then(() => {
        return Miku.sendMessage(m.from, buttonmess, { react: "🍁", quoted: m });
      });
    }
    if (cmd.react) {
      const reactm = {
        react: {
          text: cmd.react,
          key: m.key,
        },
      };
      await Miku.sendMessage(m.from, reactm);
    }
    if (!cool.has(m.sender)) {
      cool.set(m.sender, new Collection());
    }
    const now = Date.now();
    const timestamps = cool.get(m.sender);
    const cdAmount = (cmd.cool || 0) * 1000;
    if (timestamps.has(m.sender)) {
      const expiration = timestamps.get(m.sender) + cdAmount;

      if (now < expiration) {
        let timeLeft = (expiration - now) / 1000;
        //printSpam(isGroup, sender);
        return await Miku.sendMessage(
          m.from,
          {
            text: `You are on cooldown, please wait another _${timeLeft.toFixed(
              1
            )} second(s)_`,
          },
          { quoted: m }
        );
      }
    }
    timestamps.set(m.sender, now);
    setTimeout(() => timestamps.delete(m.sender), cdAmount);

    cmd.start(Miku, m, {
      name: "Miku",
      metadata,
      pushName: pushname,
      participants,
      body,
      args,
      ar,
      botNumber,
      flags,
      isAdmin,
      groupAdmin,
      text,
      quoted,
      mentionByTag,
      mime,
      isBotAdmin,
      prefix,
      isCreator,
      store,
      command: cmd.name,
      commands,
      Function: Func,
      toUpper: function toUpper(query) {
        return query.replace(/^\w/, (c) => c.toUpperCase());
      },
    });
  } catch (e) {
    e = String(e);
    if (!e.includes("cmd.start")) console.error(e);
  }
};
