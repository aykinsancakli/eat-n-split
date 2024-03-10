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
    photo: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: generateUniqueId(),
    name: "Carter",
    photo: "https://i.pravatar.cc/48?u=933369",
    balance: 20,
  },
  {
    id: generateUniqueId(),
    name: "Jordan",
    photo: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
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
    setCurFriend("");
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
        balance: 0,
      },
    ]);
  }

  function handleSelectFriend(id) {
    const selectedFriend = friends.find((friend) => friend.id === id);
    setCurFriend((prevFriend) =>
      prevFriend === selectedFriend ? "" : selectedFriend
    );
    setIsOpen(false);
  }

  function handleDeleteFriend(name) {
    setFriends(friends.filter((friend) => friend.name !== name));
    setCurFriend("");
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === curFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
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
        <InputBillData
          curFriend={curFriend}
          setCurFriend={setCurFriend}
          onSplitBill={handleSplitBill}
        />
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
        // src="img/eat-n-split-logo-transparent.png"
        src="https://aykinsancakli.github.io/eat-n-split/img/eat-n-split-logo-transparent.png"
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
          balance={friend.balance}
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
  balance,
  onSelectFriend,
  curFriend,
  onDeleteFriend,
}) {
  return (
    <div className={`friend ${curFriend.name === name ? "active" : ""}`}>
      <div className="friend-info">
        <img className="friend-photo" src={photo} alt="profile"></img>
        <div>
          <p className="friend-name">{name}</p>
          {balance < 0 && (
            <p className="red friend-status">
              You owe {name} {Math.abs(balance)}€
            </p>
          )}

          {balance > 0 && (
            <p className="green friend-status">
              {name} owes you {Math.abs(balance)}€
            </p>
          )}

          {balance === 0 && (
            <p className="friend-status">You and {name} are even</p>
          )}
        </div>
      </div>
      <div className="button-box">
        <button className="btn select-btn" onClick={() => onSelectFriend(id)}>
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

function InputBillData({ curFriend, setCurFriend, onSplitBill }) {
  const [billValue, setBillValue] = useState("");
  const [expense, setExpense] = useState("");
  // Derived state
  let expenseFriend = Math.abs(parseFloat(billValue) - parseFloat(expense));
  const [whoPays, setWhoPays] = useState("you");

  function handleSubmit(e) {
    e.preventDefault();

    if (!billValue || !expense) return;

    onSplitBill(whoPays === "you" ? expenseFriend : -expense);

    // Clear curFriend
    setCurFriend("");

    setBillValue("");
    setExpense("");
    setWhoPays("you");
    expenseFriend = "";
  }

  return (
    curFriend && (
      <form className="input-bill-form" onSubmit={handleSubmit}>
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
            onChange={(e) =>
              setExpense(
                e.target.value > billValue ? expense : Number(e.target.value)
              )
            }
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
        <button className="btn input-bill-split-btn">Split bill</button>
      </form>
    )
  );
}

function Gallery() {
  return (
    <div className="img-gallery">
      <img
        src="https://th.bing.com/th/id/OIG2.2v96hLHQGLXibbWGSxQ5?w=1024&h=1024&rs=1&pid=ImgDetMain"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG2.W_PRf2VtV4a0yYS5qbHM?pid=ImgGn"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG2.oNqikMFuY8WSDCmD57_k?pid=ImgGn"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG2.ARBtJtV1Cu.mAucNjNUO?pid=ImgGn"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG3.pST3C.UgEfyfDP8Bu6sG?w=1024&h=1024&rs=1&pid=ImgDetMain"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG3.ib2PkqPjWGsz.bIIoewu?pid=ImgGn"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG3.QBAjK9e0m1MQVQChhLpn?pid=ImgGn"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG3..Q_rvt1S_4jD_IzpEqaY?pid=ImgGn"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG3.V54R.T4QA.fBK4xGlHq4?w=1024&h=1024&rs=1&pid=ImgDetMain"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG3.oqBfiy_fEwoGIveVESBE?pid=ImgGn"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG3.V7uXOj6.Lycd2JZGJBUp?pid=ImgGn"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG3.nvgKQP3oNNqLNeE0YeT6?pid=ImgGn"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG2.5edb3YWNUOnnqMtcLVTv?pid=ImgGn"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG2.eZ5BqM.aH3gJZMt3_YwA?pid=ImgGn"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG2.zFPRErzrikkfEKFQXIR2?pid=ImgGn"
        alt="brand logos"
        className="brand-logo"
      ></img>
      <img
        src="https://th.bing.com/th/id/OIG2.rmO97nqcp4ldZc7c855t?pid=ImgGn"
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
