import { UserProfile } from '@clerk/nextjs';

const ProfilePage = () => {
  return (
    <div className="flex justify-center max-h-96">
      <UserProfile
        path="/profile"
        appearance={{
          variables: {
            colorBackground: '',
          },
        }}
      />
    </div>
  );
};

export default ProfilePage;
