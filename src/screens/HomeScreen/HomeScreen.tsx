import "./HomeScreen.css";

type HomeScreenProps = {
  /*
    Actual rendered size of the main portfolio cube.

    This is kept available for future Home-screen
    objects and responsive positioning.
  */
  cubeSize: number;
};

export default function HomeScreen({ cubeSize }: HomeScreenProps) {
  return (
    <div className="homeScreen">
      {/* ------------------------------------------------
          NORMAL HOME CONTENT
      ------------------------------------------------- */}

      <div className="homeScreenContent">
        {/* HOME content will be added here later. */}
      </div>
    </div>
  );
}
