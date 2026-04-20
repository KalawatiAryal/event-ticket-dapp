// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EventTicket {
    struct Event {
        string name;
        string date;
        string description;
        uint256 ticketPrice;
        address payable creator;
        uint256 ticketsSold;
    }

    Event[] public events;

    event EventCreated(
        uint256 indexed eventId,
        string name,
        string date,
        uint256 ticketPrice,
        address indexed creator
    );

    event TicketPurchased(
        uint256 indexed eventId,
        address indexed buyer,
        uint256 amount
    );

    function createEvent(
        string memory _name,
        string memory _date,
        string memory _description,
        uint256 _ticketPrice
    ) public {
        events.push(
            Event({
                name: _name,
                date: _date,
                description: _description,
                ticketPrice: _ticketPrice,
                creator: payable(msg.sender),
                ticketsSold: 0
            })
        );

        emit EventCreated(
            events.length - 1,
            _name,
            _date,
            _ticketPrice,
            msg.sender
        );
    }

    function buyTicket(uint256 _eventId) public payable {
        require(_eventId < events.length, "Event does not exist");

        Event storage e = events[_eventId];
        require(msg.value >= e.ticketPrice, "Not enough ETH sent");

        e.creator.transfer(msg.value);
        e.ticketsSold += 1;

        emit TicketPurchased(_eventId, msg.sender, msg.value);
    }

    function getEventsCount() public view returns (uint256) {
        return events.length;
    }

    function getEvent(uint256 _index)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint256,
            address,
            uint256
        )
    {
        require(_index < events.length, "Event does not exist");

        Event memory e = events[_index];

        return (
            e.name,
            e.date,
            e.description,
            e.ticketPrice,
            e.creator,
            e.ticketsSold
        );
    }
}