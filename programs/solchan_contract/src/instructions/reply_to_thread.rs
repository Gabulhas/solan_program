use crate::state::*;
use anchor_lang::prelude::*;

pub fn reply_to_thread(ctx: Context<ReplyToThread>, text: String, image: [u8; 32]) -> Result<()> {
    let user_acc = &mut ctx.accounts.user;
    let thread_acc = &mut ctx.accounts.thread;
    ctx.accounts
        .reply
        .set_inner(Reply::new(Content::new(user_acc.key(), text, image)));
    thread_acc.reply_count += 1;
    Ok(())
}

#[derive(Accounts)]
pub struct ReplyToThread<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    pub thread: Account<'info, Threads>,

    #[account(
        init,
        payer = user,
        space = Threads::SIZE, seeds = [b"reply", thread.key().as_ref(),(thread.reply_count + 1).to_string().as_bytes()], bump
    )]
    pub reply: Account<'info, Reply>,

    pub system_program: Program<'info, System>,
}
