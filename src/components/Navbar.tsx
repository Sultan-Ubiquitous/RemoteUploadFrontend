import {SignInButton, SignUpButton, SignedIn, SignedOut, UserButton} from "@clerk/nextjs"
const Navbar = () => {
  return (
    <div className="flex items-center justify-end gap-2 py-1 px-7">
      <SignedOut>
        <SignInButton/>
        <SignUpButton/>
      </SignedOut>
      <SignedIn>
        <UserButton/>
      </SignedIn>
    </div>
  )
}

export default Navbar;
