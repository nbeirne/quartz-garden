---
tags:
  - technology
  - selfhosting
---

Backups are one of the most important, and one of the most overlooked, areas when you start hosting your own data. 

As soon as you need to run anything of any importance, backups become perimount to ensuring you never lose your data. For that reason, I am writing up how I think about backups.

## The 3-2-1 Strategy
Most online sources recommend a 3-2-1 strategy for storing backups. Its a great approach. 
- Have 3 different places where data is stored.
- Have 2 different mediums where data lives. (Hard drives, cloud storage, tape, SSDs, etc).
- Have 1 remote backup. 

The basic idea is to spread out your failure scenarios. If your house burns down, you need a remote backup which is accessible. If your hard drives start failing, its useful to have data in a place which won't encounter that failure mode.

Remote backups are especially interesting. Using a cloud service for backups can get quite expensive (though [borgbase](https://www.borgbase.com), [b2](https://www.backblaze.com/cloud-storage), and [Hetzner](https://www.hetzner.com) offer some lower cost options) in terms of raw space and bandwidth. Backing up frequently can cause lots of headaches.

## Data Types 

I think about data in three primary types:
- Archival data.
- Operational data.
- Rebuildable data.

These data types determine how frequently backups happen and how long backups are stored for.

Archival data does not change very much, but its very important to stay around for a long time. Think taxes, family photos, old documents from previous jobs. Since archival data does not change very much and I won't notice "bad" data for a long time it has a high retention period (5 years, in my case). It's backed up daily to my "local" repositories, and weekly to any remote repositories.

Operational data changes frequently. Current documents, password manager data, Docker image configs, HomeAssistant data, etc. When this data breaks, I tend to notice quickly. It's backed up frequently, but the retention period is also much shorter. I keep 48 hourly backups, 7 daily backups, 4 weekly backups, 12 monthly backups, and I don't keep anything past a year. Operational data is backed up to remote repositories every day.

Rebuildable data is anything which I can regenerate. DVD rips, Youtube video downloads, Wikipedia data, and PDFs. This data is very large, and does not change at all. I add to it with a regular cadence, but its not "alive" in the way that operational data is. I do not back rebuildable data to remote repositories, and I only back it up locally every week. I keep one year of history.

The three categories arise from two primary questions:
- How important is the data, and how bad is it if it goes away?
- In what timeframe do you notice that your original data is bad?
- How frequently does the data change?

The answers to those three questions determine the retention, frequency, and destination for any backups you might have.


## Implementing Proper Backups

Now for the nitty-gritty. I use [borg backup](https://www.borgbackup.org) as my primary piece of software. It is encrypted, incremental, and space efficient. [restic](https://restic.net) is another good option. I also use [borg-ui](https://github.com/karanhudia/borg-ui)
 to coordinate and schedule all the backups I make. I have one instance of borg-ui running, which connects all the data and destination repos. Without going too far into it, it mounts NFS shares to access the data, then backs up using Borg's build-in [SSH support](https://borgbackup.readthedocs.io/en/stable/usage/general.html#repository-urls).

I have 9 repositories I maintain.
- exthd-archival 
- exthd-operational
- exthd-rebuildable
- cmb1-archival 
- cmb1-operational
- cmb1-rebuildable
- borgbase-archival
- borgbase-operational

exthd is an external hard drive attached to my NAS. cmb1 is a remote server which a friend gave me storage space on. Borgbase is a paid storage service. The archival/operational/rebuildable archive are exactly the same as each other, however they are not sync'd together. I run 3 different archival backups at the same cadence, but at different times of day.

## Disaster Recovery

Great. Now you have backups working, but can you restore your data? Try booting up a brand new Linux VM, and without using your password manager, try to get access to your data. You likely failed the first time. 

Try this: Write down, in a secure location, any important password you have and where the backups are located. This should include:
- Email username and password.
- The remote backup service you use, and the login information.
- The encryption keys to your backups.
- Anything else you might need. 

I put all of that information into a secondary password vault, which I set a very long password to. The vault I chose is fully offline, and is only every opened in a disaster recovery scenario. I re-run my disaster recovery testing every few months to ensure that I still remember the login information. That password vault is accessible to me in a variety of ways if I should every loose access to everything. It's in my email, a friend has a copy, and its on a few USB drives.

Whatever you do, ensure that you never loose access to your most important data. 

