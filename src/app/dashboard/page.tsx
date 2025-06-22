

export default function page() {
  return (
    <div className='flex min-h-screen justify-center items-center flex-col'>
      <p>Welcome {"UserName"} from the {"OrganizationName"}</p>
      <div className="flex items-center justify-center flex-row pt-5 gap-5">
        <p>{"If Admin"}</p> <p>{"If User"}</p>
      </div>
        <p className="pt-5">{"If user, switch organization"}</p>
    </div>
  );
};
