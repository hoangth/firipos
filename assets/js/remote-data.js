function loadBaseControls() {
  var host = getHostUrl();
  $('.users-icons').unbind("click");
  $('.users-select').unbind("click");
  $('#select-users li').remove();
  $('#users-icons').html('');
  $('#drawer-operations option').remove();
  $('#drawer-customer option').remove();
  $('#customer-lines tr').unbind("click");
  $('#customer-lines tr').remove();
  if (host != null && host.length > 0) {
    $.ajax({
        url: host + "pointofsale/base",
        type: 'post',
        dataType: 'json',
        success: function (data) {
          if (data != null) {
            if (data.error_message && data.error_message.length > 0) {
              messages.alert(data.error_message);
            } else {
              _updateCurrency(data);
              if (data.users) {
                _buildUsersControls(data.users, host);
              }
              _updateGrants(data);
              if (data.operations) {
                _buildOperationsControls(data.operations);
              }
              if (data.customers) {
                _buildCustomersControls(data.customers);
              }
              if (data.employees) {
                _buildEmployeesControls(data.employees);
              }
            }
          }
        },
        data: { 
            terminal: getTerminalID(), 
            user: getUserID()
          },
        error: parseAjaxError
    });
  }
}

function loadCategories() {
  var host = getHostUrl();
  $('#categories').html('');
  $('#products').html('');
  if (host != null && host.length > 0) {
    $.ajax({
        url: host + "pointofsale/categories",
        type: 'post',
        dataType: 'json',
        success: function (data) {
          if (data != null) {
            if (data.error_message && data.error_message.length > 0) {
              messages.alert(data.error_message);
            } else if (data.categories) {
              _buildCategoriesControls(host, data.categories);
            }
          }
        },
        data: { 
            terminal: getTerminalID(), 
            user: getUserID(),
            password: getUserPassword()
          },
        error: parseAjaxError
    });
  }
}

function loadPaymentTypes() {
  var host = getHostUrl();
  $('#payment-types').html('');
  if (host != null && host.length > 0) {
    $.ajax({
        url: host + "pointofsale/payment_types",
        type: 'post',
        dataType: 'json',
        success: function (data) {
          if (data != null) {
            if (data.error_message && data.error_message.length > 0) {
              messages.alert(data.error_message);
            } else if (data.paymenttypes) {
              _buildPaymentTypesControls(data.paymenttypes);
            }
          }
        },
        data: { 
            terminal: getTerminalID(), 
            user: getUserID(),
            password: getUserPassword()
          },
        error: parseAjaxError
    });
  }
}

function login(userID, passwordVal, modalID) {
  var host = getHostUrl();
  if (host != null && host.length > 0) {
    $.ajax({
        url: host + "pointofsale/login",
        type: 'post',
        dataType: 'json',
        success: function (data) {
          var mymodal = modalID;
          if (data != null) {
            if (data.error_message && data.error_message.length > 0) {
              messages.alert(data.error_message);
            } else {
              store.set('security_id', data.id);
              store.set('security_name', data.name);
              store.set('security_hash', data.password);
              if (mymodal) $('#' + mymodal).modal('hide');
              loadActualUser();
              loadBaseInfo();
            }
          }
        },
        data: { 
            terminal: getTerminalID(), 
            user: userID,
            password: passwordVal
          },
        error: parseAjaxError
    });
  }
}

function archivedSalesClick(e) {
  var host = getHostUrl();
  if (host != null && host.length > 0) {
    $.ajax({
        url: host + "pointofsale/archived",
        type: 'post',
        dataType: 'json',
        success: function (data) {
          if (data != null) {
            if (data.error_message && data.error_message.length > 0) {
              messages.alert(data.error_message);
            } else {
              _buildArchivedSalesControls(data.sales);
              $('#modal-archived').modal('show');
            }
          }
        },
        data: { 
            terminal: getTerminalID(), 
            user: getUserID(), 
            password: getUserPassword(),
            sale_id: $('#sale_id').val()
          },
        error: parseAjaxError
    });
  }
  e.preventDefault(); // prevents default
  return false;
}

function loadSale(id) {
  var host = getHostUrl();
  if (host != null && host.length > 0) {
    $.ajax({
        url: host + "pointofsale/sale",
        type: 'post',
        dataType: 'json',
        success: function (data) {
          $('#modal-archived').modal('hide');
          if (data != null) {
            if (data.error_message && data.error_message.length > 0) {
              messages.alert(data.error_message);
            } else {
              _buildSaleControls(data, false);
            }
          }
        },
        data: { 
            terminal: getTerminalID(), 
            user: getUserID(), 
            password: getUserPassword(),
            sale_id: id
          },
        error: parseAjaxError
    });
  }
}

function loadSaleCompleted(id) {
  var host = getHostUrl();
  if (host != null && host.length > 0) {
    $.ajax({
        url: host + "pointofsale/sale",
        type: 'post',
        dataType: 'json',
        success: function (data) {
          $('#modal-completed').modal('hide');
          if (data != null) {
            if (data.error_message && data.error_message.length > 0) {
              messages.alert(data.error_message);
            } else {
              _buildSaleControls(data, true);
            }
          }
        },
        data: { 
            terminal: getTerminalID(), 
            user: getUserID(), 
            password: getUserPassword(),
            sale_id: id
          },
        error: parseAjaxError
    });
  }
}

function deleteSale() {
  var host = getHostUrl();
  if (host != null && host.length > 0) {
    $.ajax({
        url: host + "pointofsale/remove_sale",
        type: 'post',
        dataType: 'json',
        success: function (data) {
          if (data != null) {
            if (data.error_message && data.error_message.length > 0) {
              messages.alert(data.error_message);
            } else {
              loadBaseInfo();
            }
          }
        },
        data: { 
            terminal: getTerminalID(), 
            user: getUserID(), 
            password: getUserPassword(),
            sale_id: $('#sale_id').val()
          },
        error: parseAjaxError
    });
  }
}

function changeCustomerSale(customer) {
  var host = getHostUrl();
  if (host != null && host.length > 0) {
    $.ajax({
        url: host + "pointofsale/update_sale_customer",
        type: 'post',
        dataType: 'json',
        success: function (data) {
          if (data != null) {
            if (data.error_message && data.error_message.length > 0) {
              messages.alert(data.error_message);
            } else {
              $('#sale_customer').html(((data.bpartner==null || data.bpartner.length == 0)?chrome.i18n.getMessage("customer_anonymous"):data.bpartner));
              $('#customer_id').val(data.bpartner_id);
            }
          }
        },
        data: { 
            terminal: getTerminalID(), 
            user: getUserID(), 
            password: getUserPassword(),
            sale_id: $('#sale_id').val(), 
            customer_id: customer
          },
        error: parseAjaxError
    });
  }
}

function updateProductLine(product, newqty, newprice, newdiscount) {
  var host = getHostUrl();
  if (host != null && host.length > 0) {
    $.ajax({
        url: host + "pointofsale/update_line",
        type: 'post',
        dataType: 'json',
        success: function (data) {
          if (data != null) {
            $('#modal-product').modal('hide');
            if (data.error_message && data.error_message.length > 0) {
              messages.alert(data.error_message);
            } else {
              addLine(data.product_id, data.qty, data.name, data.price, data.discount, data.total, data.name_bom, ((data.isbom=='1')?data.line_id: ''));
            }
          }
        },
        data: { 
            terminal: getTerminalID(), 
            user: getUserID(), 
            password: getUserPassword(),
            sale_id: $('#sale_id').val(),
            product_id: product,
            qty: newqty,
            price: newprice,
            discount: newdiscount
          },
        error: parseAjaxError
    });
  }
}

function removeProductLine(product) {
  var host = getHostUrl();
  if (host != null && host.length > 0) {
    $.ajax({
        url: host + "pointofsale/remove_line",
        type: 'post',
        dataType: 'json',
        success: function (data) {
          if (data != null) {
            $('#modal-product').modal('hide');
            if (data.error_message && data.error_message.length > 0) {
              messages.alert(data.error_message);
            } else {
              removeLine(((data.isbom == '1')?data.line_id + '_':'') + data.product_id);
            }
          }
        },
        data: { 
            terminal: getTerminalID(), 
            user: getUserID(), 
            password: getUserPassword(),
            sale_id: $('#sale_id').val(),
            product_id: product
          },
        error: parseAjaxError
    });
  }
}

function getCashFlowInfo() {
  gCashTotal = 0;
  var host = getHostUrl();
  if (host != null && host.length > 0) {
    $.ajax({
        url: host + "pointofsale/cash_detail",
        type: 'post',
        dataType: 'json',
        success: function (data) {
          if (data != null) {
            if (data.error_message && data.error_message.length > 0) {
              messages.alert(data.error_message);
            } else {
              _buildCashModal(data);
              $('#modal-cash').modal();
            }
          }
        },
        data: { 
            terminal: getTerminalID(), 
            user: getUserID(), 
            password: getUserPassword(),
            cash_id: gCashID
          },
        error: parseAjaxError
    });
  }
}

function addProductLine(id, quantity) {
  var host = getHostUrl();
  if (host != null && host.length > 0) {
    $.ajax({
        url: host + "pointofsale/add_line",
        type: 'post',
        dataType: 'json',
        success: function (data) {
          if (data != null) {
            if (data.error_message && data.error_message.length > 0) {
              messages.alert(data.error_message);
            } else {
              _buildSaleLineControls(data, false);
            }
          }
        },
        data: { 
            terminal: getTerminalID(), 
            user: getUserID(), 
            password: getUserPassword(),
            qty: quantity,
            product_id: id,
            sale_id: $('#sale_id').val(),
            customer_id: $('#customer_id').val()
          },
        error: parseAjaxError
    });
  }
}

function addProductBOMLine(products, quantity) {
  var host = getHostUrl();
  if (host != null && host.length > 0) {
    $.ajax({
        url: host + "pointofsale/add_line_bom",
        type: 'post',
        dataType: 'json',
        success: function (data) {
          $('#modal-bom-' + gProductsBomID).modal('hide');
          if (data != null) {
            if (data.error_message && data.error_message.length > 0) {
              messages.alert(data.error_message);
            } else {
              _buildSaleLineControls(data, true);
            }
          }
        },
        data: { 
            terminal: getTerminalID(), 
            user: getUserID(), 
            password: getUserPassword(),
            qty: quantity,
            product_id: gProductsBomID,
            products_bom: products,
            sale_id: $('#sale_id').val(),
            customer_id: $('#customer_id').val()
          },
        error: parseAjaxError
    });
  }
}

function loadCompletedSalesList(date) {
  var host = getHostUrl();
  if (host != null && host.length > 0) {
    $.ajax({
        url: host + "pointofsale/completed",
        type: 'post',
        dataType: 'json',
        success: function (data) {
          if (data != null) {
            if (data.error_message && data.error_message.length > 0) {
              messages.alert(data.error_message);
            } else {
              _buildCompletedSalesControls(data.sales);
              $('#modal-completed').modal('show');
            }
          }
        },
        data: { 
            terminal: getTerminalID(), 
            user: getUserID(), 
            password: getUserPassword(),
            report_date: date,
            sale_id: $('#sale_id').val()
          },
        error: parseAjaxError
    });
  }
}

function savePayment(qty, qtypaid) {
  var host = getHostUrl();
  if (host != null && host.length > 0) {
    $.ajax({
        url: host + "pointofsale/add_payment",
        type: 'post',
        dataType: 'json',
        success: function (data) {
          if (data != null) {
            if (data.error_message && data.error_message.length > 0) {
              messages.alert(data.error_message);
            } else {
              addPayment(data.id, data.text, data.amount);
            }
          }
        },
        data: { 
            terminal: getTerminalID(), 
            user: getUserID(), 
            password: getUserPassword(),
            sale_id: $('#sale_id').val(),
            payment_type_id: gSelectedPayment,
            amount: qty,
            amountpaid: qtypaid
          },
        error: parseAjaxError
    });
  }
}

function saveCompleteSale(qty, qtypaid) {
  var host = getHostUrl();
  if (host != null && host.length > 0) {
    $('#tpv_paid_btn').button('loading');
    $('#tpv_add_payment_btn').button('loading');

    $.ajax({
        url: host + "pointofsale/sale_complete",
        type: 'post',
        dataType: 'json',
        success: function (data) {
          $('#tpv_paid_btn').button('reset');
          $('#tpv_add_payment_btn').button('reset');
          if (data != null) {
            if (data.error_message && data.error_message.length > 0) {
              messages.alert(data.error_message);
            } else {
              if (!gDirectPrint && $('#ticket-print').prop('checked'))
                printTicket($('#sale_id').val());
              loadBaseInfo();
            }
          }
        },
        data: { 
            terminal: getTerminalID(), 
            user: getUserID(), 
            password: getUserPassword(),
            sale_id: $('#sale_id').val(),
            payment_type_id: gSelectedPayment,
            ticket: ($('#ticket-print').prop('checked')?1:0),
            direct_print: (gDirectPrint?1:0),
            amount: qty,
            amountpaid: qtypaid
          },
        error: function(jqXHR, status, errMsg) {
          $('#tpv_paid_btn').button('reset');
          $('#tpv_add_payment_btn').button('reset');
          parseAjaxError(jqXHR, status, errMsg);
        }
    });
  }
}

function removePayment(id) {
  var host = getHostUrl();
  if (host != null && host.length > 0) {
    $.ajax({
        url: host + "pointofsale/remove_payment",
        type: 'post',
        dataType: 'json',
        success: function (data) {
          if (data != null) {
            if (data.error_message && data.error_message.length > 0) {
              messages.alert(data.error_message);
            } else {
              var amount = $('#payment-item-btn-' + data.id).data("amount");
              $('#payment-item-' + data.id).remove();
              gTotalPaid -= parseFloat(amount);
              gTotalPaid = roundNumber(gTotalPaid);
              resetPreselections();
              activePayment(gDefaultPayment);
              updatePendingQty();
            }
          }
        },
        data: { 
            terminal: getTerminalID(), 
            user: getUserID(), 
            password: getUserPassword(),
            sale_id: $('#sale_id').val(),
            payment_id: id
          },
        error: parseAjaxError
    });
  }
}

function printSale() {
  if (!gDirectPrint)
    return printTicket($('#sale_id').val());

  var host = getHostUrl();
  if (host != null && host.length > 0) {
    $.ajax({
        url: host + "pointofsale/print_sale",
        type: 'post',
        dataType: 'json',
        success: function (data) {
          if (data != null) {
            if (data.error_message && data.error_message.length > 0) {
              messages.alert(data.error_message);
            }
          }
        },
        data: { 
            terminal: getTerminalID(), 
            user: getUserID(), 
            password: getUserPassword(),
            sale_id: $('#sale_id').val()
          },
        error: parseAjaxError
    });
  }
}

function openDrawer(customer, employee) {
  var host = getHostUrl();
  if (host != null && host.length > 0) {
    $.ajax({
        url: host + "pointofsale/open_drawer",
        type: 'post',
        dataType: 'json',
        success: function (data) {
          if (data != null) {
            if (data.error_message && data.error_message.length > 0) {
              messages.alert(data.error_message);
            } else {
              if (!gDirectPrint && data.id && data.id != null && data.id.length > 0)
                printCashTicket(data.id);
            }
          }
        },
        data: { 
            terminal: getTerminalID(), 
            user: getUserID(), 
            password: getUserPassword(),
            direct_print: (gDirectPrint?1:0),
            sale_id: $('#sale_id').val(),
            cash_id: gCashID,
            operation_id: $('#drawer-operations').val(),
            amount: $('#drawer-qty').val(),
            customer_id: customer,
            employee_id: employee
          },
        error: parseAjaxError
    });
  }
}

function printSalesReport(date, enddate, chkdetailed, chkcashdetail) {
  if (!gDirectPrint)
    return printSalesTicket(date, enddate, (chkdetailed?'1':'0'), (chkcashdetail?'1':'0'));

  var host = getHostUrl();
  if (host != null && host.length > 0) {
    $.ajax({
        url: host + "pointofsale/sales_report",
        type: 'post',
        dataType: 'json',
        success: function (data) {
          if (data != null) {
            if (data.error_message && data.error_message.length > 0) {
              messages.alert(data.error_message);
            } else {
            }
          }
        },
        data: { 
            terminal: getTerminalID(), 
            user: getUserID(), 
            password: getUserPassword(),
            report_date: date,
            report_enddate: enddate,
            detailed: (chkdetailed?'1':'0'),
            cashdetail: (chkcashdetail?'1':'0')
          },
        error: parseAjaxError
    });
  }
}

function saveCash(url, total) {
  var host = getHostUrl();
  if (host != null && host.length > 0) {
    $.ajax({
        url: host + "pointofsale/" + url,
        type: 'post',
        dataType: 'json',
        success: function (data) {
          if (data != null) {
            if (data.error_message && data.error_message.length > 0) {
              messages.alert(data.error_message);
            } else {
              if (data.id)
                gCashID = data.id;
              else
                gCashID = null;
              loadBaseInfo();
            }
          }
        },
        data: { 
            terminal: getTerminalID(), 
            user: getUserID(), 
            password: getUserPassword(),
            cash_id: gCashID,
            amount: total
          },
        error: parseAjaxError
    });
  }
}

function reopenSale() {
  var host = getHostUrl();
  if (host != null && host.length > 0) {
    $.ajax({
        url: host + "pointofsale/reopen",
        type: 'post',
        dataType: 'json',
        success: function (data) {
          if (data != null) {
            if (data.error_message && data.error_message.length > 0) {
              messages.alert(data.error_message);
            } else {
              loadBaseInfo();
              loadSale(data.id);
            }
          }
        },
        data: { 
            terminal: getTerminalID(), 
            user: getUserID(), 
            password: getUserPassword(),
            sale_id: $('#sale_id').val()
          },
        error: parseAjaxError
    });
  }
}