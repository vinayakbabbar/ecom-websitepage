


const categoriesTab = document.querySelector(".categories-tab");

var myObject = new Object();

function apiCall() {


  fetch(`https://ecomm.dotvik.com/v2kart/service/categories/mainCategories`)
    .then((response) => response.json())
    .then((result) => {
      // Create an array to store all promises
      const promises = [];

      result.data.forEach(function (value) {
        var categoryKey = value.urlKey;

        // Create a promise for each inner fetch
        const promise = fetch(`https://ecomm.dotvik.com/v2kart/service/categories/${categoryKey}/tree`)
          .then((response) => response.json())
          .then((result2) => {
            myObject = {
              categoryName: result2.data.categoryName,
              subCategory: {}
            };

            result2.data.subCategory.forEach(function (subCat, index) {
              myObject.subCategory[index] = {
                id: subCat.id,
                categoryName: subCat.categoryName,
                position: subCat.position,
                childCategory: {}
              };

              var flag = 0;

              result2.data.childCategory.forEach(function (childCat) {
                if (subCat.id === childCat.parentId) {
                  myObject.subCategory[index].childCategory[flag] = {
                    id: childCat.id,
                    categoryName: childCat.categoryName,
                    position: childCat.position
                  };

                  flag++;
                }
              });
            });

            return myObject; // Resolve the promise with myObject
          })
          .catch((error) => {
            console.log("error", error);
          });

        promises.push(promise);
      });

      // Use Promise.all to wait for all promises to resolve
      Promise.all(promises)
        .then((objects) => {
          // Log the resulting objects


          console.log(objects);
          myObject = objects;
          // console.log(myObject);

          displayCategory();

        })
        .catch((error) => {
          console.log("error", error);
        });
    })
    .catch((error) => {
      console.log("error", error);
    });

}

apiCall();










function displayCategory() {
  
  myObject.forEach(function (value, index) {

      var mainCategoryList = document.createElement("li");
      mainCategoryList.classList.add("categories-list");

        var categoryName = document.createElement("a");
        categoryName.href = "#"; // Set the href attribute if needed
        categoryName.textContent = value.categoryName; // Set the text content

      mainCategoryList.appendChild(categoryName);
    categoriesTab.appendChild(mainCategoryList);


    const subCategoryNames = Object.values(value.subCategory)

    // console.log(subCategoryNames.length);

    if (subCategoryNames.length>0){
    
        var dropdown = document.createElement("ul");
        dropdown.classList.add("dropdown");

            mainCategoryList.appendChild(dropdown);

              subCategoryNames.forEach(function(subCategory,index){

                var subCategoryList = document.createElement("li");
                subCategoryList.classList.add("subcategory");

                  var subCategoryName = document.createElement("a");
                  subCategoryName.href = "#"; // Set the href attribute if needed
                  subCategoryName.textContent = subCategory.categoryName;
                  subCategoryName.classList.add("subcategory");

                              
                          const childCategoryNames = Object.values(subCategory.childCategory)

                          // console.log(subCategoryNames.length);

                          var childCategoryUList =  document.createElement("ul");

                          if (childCategoryNames.length>0){

                            childCategoryNames.forEach(function(childCategory,index){

                              var childCategoryLists = document.createElement("li");
                                var childCategoryName = document.createElement("a");
                                childCategoryName.href = "#"; // Set the href attribute if needed
                                childCategoryName.textContent = childCategory.categoryName;

                                childCategoryLists.appendChild(childCategoryName);
                              childCategoryUList.appendChild(childCategoryLists);

                            })

                          }
                            

                  subCategoryList.appendChild(subCategoryName);

                subCategoryList.appendChild(childCategoryUList);

              dropdown.appendChild(subCategoryList);

              })

    }

  });

}


