use crate::state::*;
use anchor_lang::prelude::*;

pub fn init_imageboard(ctx: Context<InitImageboard>) -> Result<()> {
    let authority = &mut ctx.accounts.authority;
    ctx.accounts
        .imageboard
        .set_inner(Imageboard::new(authority.key()));
    Ok(())
}

#[derive(Accounts)]
pub struct InitImageboard<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = Imageboard::SIZE, seeds = [b"imageboard"], bump
    )]
    pub imageboard: Account<'info, Imageboard>,

    pub system_program: Program<'info, System>,
}
