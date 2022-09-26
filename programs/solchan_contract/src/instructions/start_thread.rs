use crate::state::*;
use anchor_lang::prelude::*;

pub fn start_thread(ctx: Context<StartThread>, text: String, image: [u8; 32]) -> Result<()> {
    let user_acc = &mut ctx.accounts.user;
    let imageboard_acc = &mut ctx.accounts.imageboard;
    ctx.accounts
        .thread
        .set_inner(Threads::new(Content::new(user_acc.key(), text, image)));
    imageboard_acc.threads += 1;
    Ok(())
}

#[derive(Accounts)]
pub struct StartThread<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut, seeds = [b"imageboard".as_ref()], bump)]
    pub imageboard: Account<'info, Imageboard>,

    #[account(
        init,
        payer = user,
        space = Threads::SIZE, seeds = [b"thread", (imageboard.threads + 1).to_string().as_bytes()], bump
    )]
    pub thread: Account<'info, Threads>,

    pub system_program: Program<'info, System>,
}
