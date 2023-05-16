$(".input-container").hide();
displayContacts();

function displayContacts() {
  $.get("/api/contacts", function (contacts) {
    console.log(contacts);
    for (let contact in contacts) {
      let $span = $("span");
      let $contactInfo = $("<div>")
        .addClass("contact-info")
        .text(
          contacts[contact].id +
            " | " +
            contacts[contact].first_name +
            " " +
            contacts[contact].last_name +
            " | " +
            contacts[contact].phone_number +
            " | " +
            contacts[contact].address
        );
      let $icon = $("<i>").addClass("fa fa-user fa-lg");

      let $deleteButton = $("<button>")
        .addClass("btn btn-danger btn-sm")
        .text("Delete")
        .data("contactId", contacts[contact].id)
        .on("click", function () {
          deleteContact($(this).data("contactId"));
        });

      let $deleteButtonDiv = $("<div>").addClass("button-div");
      $deleteButtonDiv.append($deleteButton);
      $contactInfo.prepend($icon);
      $contactInfo.append($deleteButtonDiv);
      $span.append($contactInfo);
    }
  });
}

//submit a new contact using POST method
//showing the input container to enter in desired contact info
let $newContact = $("#new-contact");
$newContact.on("click", function () {
  $(".input-container").show();
  $("#submit-contact").show();
  $("#id").hide();
  $("#submit-change").hide();
});

$("#submit-contact").on("click", function () {
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
      let $contactInfo = $("<div>")
        .addClass("contact-info")
        .text(
          newContact[0].id +
            " | " +
            newContact[0].first_name +
            " " +
            newContact[0].last_name +
            " | " +
            newContact[0].phone_number +
            " | " +
            newContact[0].address
        );
      let $deleteButton = $("<button>")
        .addClass("btn btn-danger btn-sm")
        .text("Delete")
        .data("contactId", newContact[0].id)
        .on("click", function () {
          deleteContact($(this).data("contactId"));
        });
      let $deleteButtonDiv = $("<div>").addClass("button-div");
      $deleteButtonDiv.append($deleteButton);
      $contactInfo.append($deleteButtonDiv);
      $span.append($contactInfo);
      $(".input-container").hide();
      $("input").val("");
    },
  });
});

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
