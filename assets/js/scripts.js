const keypad_input = document.getElementById('keypad_input');
const keypad_buttons = document.getElementById('keypad').getElementsByClassName('button');
const legend = document.getElementById('legend');
const loading_modal = document.getElementById('loading_modal');
const add_form = document.getElementById('add_form');
const add_input = document.getElementById('add_input');
const remove_buttons = document.getElementsByClassName('remove');
const message_box = document.getElementById('message_box');
const message_logo = document.getElementById('message_logo');
const message_link = document.getElementById('message_link');
const message_url = document.getElementById('message_url');
const burger = document.getElementsByClassName('navbar-burger')[0];
const menu = document.getElementsByClassName('navbar-menu')[0];
const table = document.getElementsByClassName('table')[0];
const about = document.getElementById('about');
const about_modal = document.getElementById('about_modal');

let websites = [
  'https://recycledrobot.co.uk',
  'https://google.com',
  'https://drive.google.com',
  'https://mail.google.com',
  'https://maps.google.com',
  'https://facebook.com',
  'https://twitter.com',
  'https://reddit.com',
  'https://pinterest.com',
  'https://instagram.com',
  'https://linkedin.com',
  'https://craigslist.org',
  'https://stackoverflow.com'
];


function generate_legend(live_mode) {
  if (localStorage.websites) {
    websites = JSON.parse(localStorage.websites);
  }
  var legend_html = '';
  if (websites.length) {
    for (var i = 0; i < websites.length; i++) {
      let cut_url = websites[i].replace('https://', '');
      legend_html += `
      <tr>
        <td>${i}</td>
        <td><a href='${websites[i]}'>${cut_url}</a></td>
        <td class='remove' data-id='${i}'><i class='fas fa-md fa-times remove' data-id='${i}'></i></td>
      </tr>
      `;
    }
    legend.innerHTML = legend_html;
    if (table.classList.contains('is-hidden')) {
      table.classList.remove('is-hidden');
    }
  } else {
    table.classList.add('is-hidden');
  }

  if (!live_mode) {
    for (var i = 0; i < keypad_buttons.length; i++) {
      keypad_buttons[i].addEventListener('click', function(e) {
        let button_value = e.target.textContent;
        if (button_value === 'C') {
          keypad_input.value = '';
        } else if (button_value === 'GO') {
          if (keypad_input.value.length && websites[keypad_input.value] != undefined) {
            loading_modal.style.display = 'block';
            window.location = websites[keypad_input.value];
          }
        } else {
          keypad_input.value += button_value;
        }
        if (websites[keypad_input.value] != undefined) {
          if (message_box.classList.contains('is-hidden')) {
            message_box.classList.remove('is-hidden');
          }
          var preview_url = websites[keypad_input.value].replace('https://', '');
          message_url.textContent = preview_url;
          message_logo.setAttribute('src', `https://logo.clearbit.com/${preview_url}`);
          message_link.setAttribute('href', websites[keypad_input.value]);
        } else {
          message_box.classList.add('is-hidden');
        }
      });
    }
  }

  for (var i = 0; i < remove_buttons.length; i++) {
    remove_buttons[i].addEventListener('click', function(e) {
      websites.splice(parseInt(e.target.getAttribute('data-id')), 1);
      localStorage.setItem('websites', JSON.stringify(websites));
      generate_legend(true);
    });
  }
}


function add_formatter(input, format_fn) {
  let old_value = add_input.value;

  const handle_input = event => {
    const result = format_fn(add_input.value, old_value, event);
    if (typeof result === 'string') {
      add_input.value = result;
    }
    old_value = input.value;
  }

  handle_input();
  add_input.addEventListener('input', handle_input);
}


function regex_prefix(regex, prefix) {
  return (new_value, old_value) => regex.test(new_value) ? new_value : (new_value ? old_value : prefix);
}


document.addEventListener('DOMContentLoaded', function() {

  if (typeof(Storage) !== 'undefined') {
    generate_legend(false);

    add_form.addEventListener('submit', function(e) {
      e.preventDefault();
      let add_url = add_form.elements[0].value;
      websites.push(add_url);
      localStorage.setItem('websites', JSON.stringify(websites));
      generate_legend(true);
      add_input.value = 'https://';
    });
  } else {
    alert('Sorry! No Web Storage support..')
  }

  add_formatter(add_input, regex_prefix(/^https?:\/\//, 'https://'));

  burger.addEventListener('click', function() {
    burger.classList.toggle('is-active');
    menu.classList.toggle('is-active');
  });

  about.addEventListener('click', function() {
    about_modal.classList.toggle('is-hidden');
  });

  message_logo.addEventListener('error', function(e) {
    message_logo.setAttribute('src', 'assets/img/nope.png');
  });
});
