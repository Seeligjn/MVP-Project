$(".input-container").hide();
displayContacts();

function displayContacts() {
  $.get("/api/contacts", function (contacts) {
    console.log(contacts);
    for (let contact in contacts) {
      let $span = $("span");
      //create new div for each contact in DB
      let $contactInfo = $("<div>")
        .addClass("contact-info")
        .text(
          `${contacts[contact].id} || ${contacts[contact].first_name} ${contacts[contact].last_name} ${contacts[contact].phone_number} ${contacts[contact].address}`
        );
      //add delete button for each contact with event listener which tags each button with the id of the div its attached to -----> see deleteContact function below
      let $deleteButton = $("<button>")
        .addClass("btn btn-danger btn-sm")
        .text("Delete")
        .data("contactId", contacts[contact].id)
        .on("click", function () {
          deleteContact($(this).data("contactId"));
        });
      let $icon = $("<i>").addClass("fa fa-user fa-lg");
      let $deleteButtonDiv = $("<div>").addClass("button-div");
      $deleteButtonDiv.append($deleteButton);
      $contactInfo.prepend($icon);
      $contactInfo.append($deleteButtonDiv);
      $span.append($contactInfo);
    }
  });
}

//submit a new contact using POST method
//show the input container to enter in desired contact info
let $newContact = $("#new-contact");
$newContact.on("click", function () {
  $(".input-container").show();
  $("#submit-contact").show();
  $("#id").hide();
  $("#submit-change").hide();
});

$("#submit-contact").on("click", function () {
  //create contact object to use as the value for data in the post request
  let contact = {
    first_name: $("#first-name").val(),
    last_name: $("#last-name").val(),
    phone_number: $("#phone-number").val(),
    address: $("#address").val(),
  };
  if (contact.phone_number.length > 10) {
    alert("Please enter a valid Phone Number");
  } else if (
    $("#first-name").val() === "" &&
    $("#last-name").val() === "" &&
    $("#phone-number").val() === "" &&
    $("#address").val() === ""
  ) {
    alert("You must fill in atleast one of the provided fields");
  }
  $.ajax({
    type: "POST",
    url: "/api/contacts",
    data: JSON.stringify(contact),
    contentType: "application/json",
    success: function (newContact) {
      console.log(newContact);
      let $span = $("span");
      //create a new div for the new contact when submitted and adding the fields that were given.
      let $contactInfo = $("<div>")
        .addClass("contact-info")
        .text(
          `${newContact[0].id} || ${newContact[0].first_name} ${newContact[0].last_name} ${newContact[0].phone_number} ${newContact[0].address}`
        );
      //add delete button using the same method as the display function delete button
      let $deleteButton = $("<button>")
        .addClass("btn btn-danger btn-sm")
        .text("Delete")
        .data("contactId", newContact[0].id)
        .on("click", function () {
          deleteContact($(this).data("contactId"));
        });
      let $icon = $("<i>").addClass("fa fa-user fa-lg");
      let $deleteButtonDiv = $("<div>").addClass("button-div");
      $deleteButtonDiv.append($deleteButton);
      $contactInfo.prepend($icon);
      $contactInfo.append($deleteButtonDiv);
      $span.append($contactInfo);
      $(".input-container").hide();
      $("input").val("");
    },
  });
});

//select edit button and hide/show required items from input container div
let $editButton = $("#edit");
$editButton.on("click", function () {
  $(".input-container").show();
  $("#submit-contact").hide();
  $("#id").show();
  $("#submit-change").show();
});

$("#submit-change").on("click", function () {
  let contact = {
    first_name: $("#first-name").val(),
    last_name: $("#last-name").val(),
    phone_number: $("#phone-number").val(),
    address: $("#address").val(),
    id: $("#id").val(),
  };
  if ($("#id").val() === "") {
    alert("Please provide the ID of the contact you would like to edit");
  }
  //check value of keys to make sure it doesnt convert not filled in fields to empty strings.
  Object.keys(contact).forEach((key) => {
    if (contact[key] === "") {
      delete contact[key];
    }
  });

  $.ajax({
    type: "PATCH",
    url: "/api/contacts/" + contact.id,
    data: JSON.stringify(contact),
    contentType: "application/json",
    success: function () {
      $("span").empty();
      displayContacts();
      $("input").val("");
      $(".input-container").hide();
    },
  });
});

function deleteContact(contactId) {
  $.ajax({
    type: "DELETE",
    url: "/api/contacts/" + contactId,
    success: function () {
      $("span").empty();
      displayContacts();
    },
  });
}
