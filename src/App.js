import { useState } from "react";

const generateUniqueId = () => {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 10000);
  return timestamp - randomNum;
};

const initialFriends = [
  {
    id: generateUniqueId(),
    name: "Ellis",
    photo: "https://i.pravatar.cc/48",
    status: "You owe Ellis 7€",
  },
  {
    id: generateUniqueId(),
    name: "Carter",
    photo: "https://i.pravatar.cc/49",
    status: "Carter owes you 20€",
  },
  {
    id: generateUniqueId(),
    name: "Jordan",
    photo: "https://i.pravatar.cc/50",
    status: "You and Jordan are even",
  },
];

function App() {
  return (
    <div className="App">
      <EatNSplit />
    </div>
  );
}

export default App;

function EatNSplit() {
  const [friends, setFriends] = useState([...initialFriends]);
  const [friendName, setFriendName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [curFriend, setCurFriend] = useState("");

  function handleIsOpen() {
    setIsOpen((isOpen) => !isOpen);
  }

  function handleAddFriends(e, name, url) {
    e.preventDefault();

    if (!name) return; // Guard clause ;)

    setIsOpen((isOpen) => !isOpen);
    setFriendName("");

    setFriends([
      ...friends,
      {
        id: generateUniqueId(),
        name: name,
        photo: url,
        status: `You and ${name} are even`,
      },
    ]);
  }

  function handleSelectFriend(name) {
    const selectedFriend = friends.find((friend) => friend.name === name);
    setCurFriend((prevFriend) =>
      prevFriend === selectedFriend ? "" : selectedFriend
    );
  }

  function handleDeleteFriend(name) {
    setFriends(friends.filter((friend) => friend.name !== name));
    setCurFriend("");
  }

  return (
    <>
      <Header />
      <div className="container">
        <div className="container-flex">
          <FriendsList
            friends={friends}
            onSelectFriend={handleSelectFriend}
            curFriend={curFriend}
            onDeleteFriend={handleDeleteFriend}
          />

          <AddNewFriends
            friends={friends}
            friendName={friendName}
            setFriendName={setFriendName}
            onAddFriends={handleAddFriends}
            isOpen={isOpen}
            onIsOpen={handleIsOpen}
          />
        </div>
        <InputBillData curFriend={curFriend} setCurFriend={setCurFriend} />
      </div>
      <Gallery />
      <Footer />
    </>
  );
}

function Header() {
  return (
    <header className="header">
      <h1>Eat N Split</h1>
      <img
        className="logo"
        src="img/eat-n-split-logo-transparent.png"
        alt="logo"
      />
      <p>Easily Split Bills with Friends...</p>
    </header>
  );
}

function FriendsList({ friends, onSelectFriend, curFriend, onDeleteFriend }) {
  return (
    <div className="friends-list">
      {friends.map((friend) => (
        <Friend
          id={friend.id}
          name={friend.name}
          photo={friend.photo}
          status={friend.status}
          key={friend.id}
          onSelectFriend={onSelectFriend}
          curFriend={curFriend}
          onDeleteFriend={onDeleteFriend}
        />
      ))}
    </div>
  );
}

function Friend({
  id,
  name,
  photo,
  status,
  onSelectFriend,
  curFriend,
  onDeleteFriend,
}) {
  const owesClass = status.includes("owes") ? "owes" : "owe";
  const evenClass = status.includes("even") ? "even" : "";

  return (
    <div className={`friend ${curFriend.name === name ? "active" : ""}`}>
      <div className="friend-info">
        <img className="friend-photo" src={photo} alt="profile"></img>
        <div>
          <p className="friend-name">{name}</p>
          <p className={`friend-status ${evenClass} ${owesClass}`}>{status}</p>
        </div>
      </div>
      <div className="button-box">
        <button className="btn select-btn" onClick={() => onSelectFriend(name)}>
          {curFriend.name === name ? "Close" : "Select"}
        </button>
        <button className="btn delete-btn" onClick={() => onDeleteFriend(name)}>
          Delete
        </button>
      </div>
    </div>
  );
}

function AddNewFriends({
  friends,
  friendName,
  setFriendName,
  onAddFriends,
  isOpen,
  onIsOpen,
}) {
  const [imageUrl, setImageUrl] = useState("https://i.pravatar.cc/48");

  return (
    <>
      <button
        className={`btn btn-open-form ${isOpen ? "hidden" : ""}`}
        onClick={onIsOpen}
      >
        Add friend
      </button>
      <div className={`form-flex ${isOpen ? "open" : "hidden"}`}>
        <form className="add-friends-form">
          <div>
            <span>👥 Friend name</span>{" "}
            <input
              type="text"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
            ></input>
          </div>
          <div>
            <span>🌅 Image URL</span>{" "}
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            ></input>
          </div>
          <button
            className="btn add-friends-btn"
            onClick={(e) => onAddFriends(e, friendName, imageUrl)}
          >
            Add
          </button>
        </form>
        <button className="btn add-friends-close-btn" onClick={onIsOpen}>
          Close
        </button>
      </div>
    </>
  );
}

function InputBillData({ curFriend, setCurFriend }) {
  const [billValue, setBillValue] = useState("");
  const [expense, setExpense] = useState("");
  const [whoPays, setWhoPays] = useState("you");

  // Derived state
  let expenseFriend = Math.abs(parseFloat(billValue) - parseFloat(expense));

  function handleSplitBill(e) {
    e.preventDefault();

    // Validate input
    if (isNaN(billValue) || isNaN(expense) || billValue <= 0 || expense < 0) {
      return alert("Please enter valid values for bill value and expense!");
    }

    // Clear curFriend
    setCurFriend("");

    if (whoPays === "you")
      curFriend.status = `${curFriend.name} owes you ${expenseFriend}€`;

    if (whoPays === curFriend.name)
      curFriend.status = `You owe ${curFriend.name} ${expense}€ `;

    setBillValue("");
    setExpense("");
    setWhoPays("you");
    expenseFriend = "";
  }

  return (
    curFriend && (
      <form className="input-bill-form">
        <h2 className="heading-secondary">
          Split a Bill With <span className="split-user">{curFriend.name}</span>
        </h2>
        <div>
          <span>💵 Bill value</span>{" "}
          <input
            type="text"
            value={billValue}
            onChange={(e) => setBillValue(Number(e.target.value))}
          ></input>
        </div>
        <div>
          <span>🏷️ Your expense</span>{" "}
          <input
            type="text"
            value={expense}
            onChange={(e) => setExpense(Number(e.target.value))}
          ></input>
        </div>
        <div>
          <span>🤝 {curFriend.name}'s expense</span>
          <input
            type="text"
            value={isNaN(expenseFriend) ? "" : expenseFriend}
            disabled
          ></input>
        </div>
        <div>
          <span>💳 Who is paying the bill?</span>
          <select value={whoPays} onChange={(e) => setWhoPays(e.target.value)}>
            <option value="you">You</option>
            <option value={curFriend.name}>{curFriend.name}</option>
          </select>
        </div>
        <button className="btn input-bill-split-btn" onClick={handleSplitBill}>
          Split bill
        </button>
      </form>
    )
  );
}

function Gallery() {
  return (
    <div className="img-gallery">
      <img
        src="https://th.bing.com/th/id/OIG1.40BxEe8JEcBUK2WdJdPZ?w=1024&h=1024&rs=1&pid=ImgDetMain"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG1.cjiCt5rrX1PBMzKIXGhe?pid=ImgGn"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG1.AkBhOZ6.2ok12udu_Vdt?pid=ImgGn"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG1.ETmK8npRehSGnsC17mGn?pid=ImgGn"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG3.CwZF5Wf8HUUHEGUpnkqJ?pid=ImgGn"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG3.i1GJ8WmA1t6am47hBo0c?pid=ImgGn"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG3.BOlr0Gqt7kcqzzqjK9gn?pid=ImgGn"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG3.bBPQuqhfr_aO1btz08B9?pid=ImgGn"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG1.LklJFdlMt4D51CXdedR6?pid=ImgGn"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG1.JipOCbgYDg3gqGzx5yEj?pid=ImgGn"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG1.R6efrx3Np4mqzO8y7Hbk?pid=ImgGn"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG1.IIQqI8VpN7IFjWLSnl4v?pid=ImgGn"
        alt="brand logos"
        className="brand-logo"
      ></img>
    </div>
  );
}

function Footer() {
  const date = new Date();
  const year = date.getFullYear();

  return (
    <footer className="footer">
      <p>&copy; {year} Eat N Split | All Rights Reserved</p>
    </footer>
  );
}
